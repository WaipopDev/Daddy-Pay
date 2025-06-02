import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Server-side utility function to handle token expiration
export async function handleTokenExpiration(): Promise<NextResponse> {
    try {
        // Clear the token cookie using Next.js cookies API
        const cookieStore = await cookies();
        cookieStore.set('token', '', {
            path: '/',
            httpOnly: true,
            maxAge: 0,
        });
        
        // Return a response that instructs the client to redirect to login
        const response = NextResponse.json(
            { 
                message: 'Token expired. Please login again.', 
                redirect: '/login',
                tokenExpired: true 
            }, 
            { 
                status: 401,
                headers: {
                    'x-token-expired': 'true'
                }
            }
        );

        // Also set the cookie in the response to ensure it's cleared
        response.cookies.set('token', '', {
            path: '/',
            httpOnly: true,
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error('Error during token expiration handling:', error);
        const response = NextResponse.json(
            { 
                message: 'Session expired. Please login again.', 
                redirect: '/login',
                tokenExpired: true 
            }, 
            { 
                status: 401,
                headers: {
                    'x-token-expired': 'true'
                }
            }
        );

        // Ensure cookie is cleared even in error case
        response.cookies.set('token', '', {
            path: '/',
            httpOnly: true,
            maxAge: 0,
        });

        return response;
    }
}
