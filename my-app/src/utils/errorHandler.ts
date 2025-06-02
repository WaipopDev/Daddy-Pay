import axios from 'axios';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface ErrorHandlerOptions {
  showAlert?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

export const getErrorMessage = (error: unknown, options: ErrorHandlerOptions = {}): string => {
  const { customMessage } = options;
  
  if (customMessage) {
    return customMessage;
  }
  
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

export const handleError = (
  error: unknown, 
  dispatch: any, 
  openModalAlert: any, 
  options: ErrorHandlerOptions = {}
): string => {
  const { showAlert = true, logToConsole = true } = options;
  const errorMessage = getErrorMessage(error, options);
  
  if (logToConsole) {
    console.log("🚀 ~ Error:", errorMessage);
    if (axios.isAxiosError(error)) {
      console.log("🚀 ~ Full Error:", error.response?.data || error);
    }
  }
  
  if (showAlert && dispatch && openModalAlert) {
    dispatch(openModalAlert({ 
      message: errorMessage, 
      title: "Alert Message" 
    }));
  }
  
  return errorMessage;
};

// Utility function to handle token expiration
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