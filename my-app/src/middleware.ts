import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios';
import { LRUCache } from 'lru-cache'
const options = {
    max: 5000, // maximum number of items that can be stored in the cache
    ttl: 1000 * 60 * 30 // 30 minutes
}
const cache = new LRUCache(options)

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const lang = req.cookies.get('lang')?.value || 'en'; 
    // const role = req.cookies.get('role')?.value;
    // const cacheKey = `user-data-${token}`;
    
    const publicPages = ['/login', '/logout'];

    // Allow public pages to load without redirection
    if (publicPages.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }

    let userData = cache.get('token');
    // console.log("🚀 ~ middleware ~ userData:", userData)

    if (!userData) {
        try {
            const res = await axios.get(`${process.env.API_URL}/api/v1/admin/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            userData = res.data;
            if (userData) {
                cache.set('token', userData);

            }
        } catch (err) {
            // console.log("🚀 ~ middleware ~ err:", err)
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('error', 'token');
            url.searchParams.set('v', `${new Date().getTime()}`);
            const response = NextResponse.redirect(url);
            response.cookies.set('token', '', { path: '/', expires: new Date(0) });
            
            return response;
        }
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
        response.headers.set(
            'x-user-data',
            Buffer.from(JSON.stringify(userData), 'utf-8').toString('base64')
        );
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