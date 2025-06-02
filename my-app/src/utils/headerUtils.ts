import { NextResponse } from 'next/server';
import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';

/**
 * Headers that should be forwarded from backend API responses to client
 */
const HEADERS_TO_FORWARD = [
    'x-token-refreshed', 'X-Token-Refreshed',
    'x-new-token', 'X-New-Token', 
    'x-token-expired', 'X-Token-Expired'
];

/**
 * Forward important headers from backend API response to NextResponse
 * @param backendResponse - The axios response from backend API
 * @param nextResponse - The NextResponse to send to client
 */
export async function forwardHeaders(backendResponse: AxiosResponse, nextResponse: NextResponse): Promise<void> {
    // Check for token refresh headers with case variations
    const newToken = backendResponse.headers['x-new-token'] || 
                    backendResponse.headers['X-New-Token'] ||
                    backendResponse.headers['X-NEW-TOKEN'];
    const tokenRefreshed = backendResponse.headers['x-token-refreshed'] || 
                          backendResponse.headers['X-Token-Refreshed'] ||
                          backendResponse.headers['X-TOKEN-REFRESHED'];

    // Update token cookie if refresh is indicated
    if (tokenRefreshed === 'true' && newToken) {
        try {
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'token',
                value: newToken,
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60, // 1 hour
                // secure: process.env.NODE_ENV === 'production',
                // sameSite: 'lax'
            });
            console.log('🔄 Token cookie updated automatically on server side');
        } catch (error) {
            console.error('❌ Failed to update token cookie on server side:', error);
        }
    }

    // Forward all relevant headers to the client
    HEADERS_TO_FORWARD.forEach(headerName => {
        const headerValue = backendResponse.headers[headerName];
        if (headerValue) {
            nextResponse.headers.set(headerName, headerValue);
            console.log(`🔄 Forwarding header: ${headerName} = ${headerValue}`);
        }
    });
}

/**
 * Create a NextResponse with data and forward headers from backend response
 * @param data - The data to send in the response
 * @param backendResponse - The axios response from backend API
 * @param status - HTTP status code (default: 200)
 */
export async function createResponseWithHeaders(
    data: any, 
    backendResponse: AxiosResponse, 
    status: number = 200
): Promise<NextResponse> {
    const nextResponse = NextResponse.json(data, { status });
    await forwardHeaders(backendResponse, nextResponse);
    return nextResponse;
}
