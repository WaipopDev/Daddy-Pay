
import { NextResponse } from "next/server";
import { LRUCache } from 'lru-cache'
import { clearDataUser } from "@/app/actions";

const options = {
    max: 5000, // maximum number of items that can be stored in the cache
    ttl: 1000 * 60 * 10 // 10 minutes
}
const cache = new LRUCache(options)

export async function GET() {
    // Clear user data cache
    await clearDataUser()
    cache.delete('x-user-data-cache');
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear all cookies that might contain user data
    response.cookies.set('token', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0,
        expires: new Date(0)
    });
    // Remove x-user-data header
    response.headers.delete('x-user-data');
    return response;
}