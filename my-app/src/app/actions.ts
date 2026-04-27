'use server';
import { cookies } from 'next/headers'

export async function getData() {
    const token = (await cookies()).get('token')?.value
    if (!token) {
        throw new Error('No authentication token found');
    }
    const apiUrl = process.env.API_URL
    if (!apiUrl) {
        throw new Error('API_URL is not configured');
    }
    const res = await fetch(`${apiUrl}/api/v1/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    })
    if (!res.ok) {
        throw new Error(`Failed to load user: ${res.status}`);
    }
    return res.json();
}

export async function clearDataUser() {
    (await cookies()).set('token', '', { path: '/', expires: new Date(0) });
    (await cookies()).set('role', '', { path: '/', expires: new Date(0) });
    return new Response('User data cleared', { status: 200 });
}