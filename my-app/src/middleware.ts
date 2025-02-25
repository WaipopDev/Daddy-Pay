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
    const role = req.cookies.get('role')?.value;
    const cacheKey = `user-data-${token}`;
    
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

    let userData = cache.get(cacheKey);

    if (!userData) {
        try {
            const res = await axios.get(`${process.env.API_URL}/v1/admin/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            userData = res.data?.data;
            if (userData) {
                // if(res.data?.data?.id !== 1){
                //     const resUser = await axios.get(`${process.env.API_URL}/v1/admin/users/${res.data?.data?.id}`, {
                //         headers: {
                //             Authorization: `Bearer ${token}`,
                //         },
                //     });
                //     userData = {
                //         ...userData,
                //         permissions: resUser.data?.data.permissions
                //     }
                // }
                cache.set(cacheKey, userData);

            }
        } catch (err) {
            // console.error('🚀 ~ middleware ~ API error:', err);
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            const response = NextResponse.redirect(url);
            response.cookies.set('token', '', { path: '/', expires: new Date(0) });
            response.cookies.set('role', '', { path: '/', expires: new Date(0) });
            return response;
        }
    }

    const response = NextResponse.next();
    if (userData) {
        response.headers.set(
            'x-user-data',
            Buffer.from(JSON.stringify(userData), 'utf-8').toString('base64')
        );
    }

    if (req.nextUrl.pathname === '/login' && role === 'admin') {
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashboardUrl);
    }


    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|.*\\.png$).*)'],
}