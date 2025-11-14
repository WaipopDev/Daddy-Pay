import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios';
import { LRUCache } from 'lru-cache'
const options = {
    max: 5000, // maximum number of items that can be stored in the cache
    ttl: 1000 * 60 * 10 // 10 minutes
}
const cache = new LRUCache(options)

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const lang = req.cookies.get('lang')?.value || 'en'; 
    // const role = req.cookies.get('role')?.value;
    const cacheKey = token ? `user-data-${token}` : null;
    
    const publicPages = ['/login', '/logout'];

    // Allow public pages to load without redirection
    if (req.nextUrl.pathname === '/login') {
        console.log('req.nextUrl.pathname', req.nextUrl.pathname)
        // Delete cache for the current token if it exists
        if (token) {
            const oldCacheKey = `user-data-${token}`;
            cache.delete(oldCacheKey);
        }
        const response = NextResponse.next();
        response.cookies.set('token', '', { path: '/', expires: new Date(0) });
        response.headers.delete('x-user-data');
        return response;
    }
    if (publicPages.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }

    let userData = cacheKey ? cache.get(cacheKey) : null
    // console.log('userData', userData)
    let newToken = token;
    if (!userData) {
        try {
            const res = await axios.get(`${process.env.API_URL}/api/v1/admin/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log('res', res.data)
            const xNewToken = res.headers['X-New-Token'];
            const xTokenRefreshed = res.headers['X-Token-Refreshed'];
            if (xTokenRefreshed === 'true' && xNewToken) {
                newToken = xNewToken;
                console.log('Token refreshed automatically');
                // Delete old cache entry when token is refreshed
                if (cacheKey) {
                    cache.delete(cacheKey);
                }
            }
            userData = res.data;
            if (userData) {
                // Use new token for cache key if token was refreshed
                const finalCacheKey = newToken ? `user-data-${newToken}` : cacheKey;
                if (finalCacheKey) {
                    cache.set(finalCacheKey, JSON.stringify(userData), { ttl: 1000 * 60 * 10 });
                }
            }
        } catch (err) {
            console.log("🚀 ~ middleware ~ err:", err)
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('error', 'token');
            url.searchParams.set('v', `${new Date().getTime()}`);
            const response = NextResponse.redirect(url);
            response.cookies.set('token', '', { path: '/', expires: new Date(0) });
            if (cacheKey) {
                cache.delete(cacheKey);
            }
            
            return response;
        }
    }else{
        userData = JSON.parse(userData as string);
    }
    const response = NextResponse.next();
    response.headers.set('x-user-lang', lang);
    if (!req.cookies.get('lang')) {
        response.cookies.set('lang', 'en', {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 วัน
        });
    }

    if (userData) {
        response.cookies.set('token', newToken, { path: '/', httpOnly: true })
        
        // Monitor userData size
        const userDataJson = JSON.stringify(userData);
        const userDataSize = Buffer.byteLength(userDataJson, 'utf8');
        const base64Data = Buffer.from(userDataJson, 'utf-8').toString('base64');
        const base64Size = Buffer.byteLength(base64Data, 'utf8');
        
        // Log size for monitoring
        console.log(`UserData size: ${userDataSize} bytes, Base64: ${base64Size} bytes (${(base64Size/1024).toFixed(2)} KB)`);
        
        // Warning if approaching limit
        if (base64Size > 6144) { // 6KB warning
            console.warn(`⚠️  UserData approaching size limit: ${base64Size} bytes`);
        }
        
        response.headers.set('x-user-data', base64Data);
    }

    if (req.nextUrl.pathname === '/login' ) {
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashboardUrl);
    }


    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|.*\\.png$).*)'],
}