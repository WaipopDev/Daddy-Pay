'use server';
import { cookies, headers } from 'next/headers'
export async function getData() {
    const authHeader = (await headers()).get('x-user-data')
    if (!authHeader) {
        throw new Error('No authentication header found');
    }
    const decodedData = Buffer.from(authHeader, 'base64').toString('utf-8');
    return JSON.parse(decodedData);
}

export async function clearDataUser() {
    (await cookies()).set('token', '', { path: '/', expires: new Date(0) });
    (await cookies()).set('role', '', { path: '/', expires: new Date(0) });
    return new Response('User data cleared', {
        status: 200,
        headers: {
            'x-user-data': '' // Clear the header by setting it empty
        }
    });
}