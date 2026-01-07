import { NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { cookies } from "next/headers";
import { handleTokenExpiration } from "@/utils/serverErrorHandler";
import { createResponseWithHeaders } from "@/utils/headerUtils";

export async function POST(_request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const body = await _request.json();
        const { currentPassword, newPassword } = body;
        
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: 'New password must be at least 6 characters' }, { status: 400 });
        }

        if (currentPassword === newPassword) {
            return NextResponse.json({ message: 'New password must be different from current password' }, { status: 400 });
        }

        const passwordData = {
            oldPassword: currentPassword,
            newPassword: newPassword
        };

        const response = await axios.patch(
            `${process.env.API_URL}/api/v1/user/change-password`, 
            passwordData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            return await createResponseWithHeaders(
                { message: 'Password changed successfully' },
                response,
                200
            );
        } else {
            return NextResponse.json({ message: 'Failed to change password' }, { status: 401 });
        }
    } catch (error) {
        const err = error as AxiosError;
        console.log('Change password error:', err.response);
        
        // Check for token expiration
        if (err.response?.headers && err.response.headers['x-token-expired']) {
            console.log('Token expired detected in change password, initiating logout process');
            return await handleTokenExpiration();
        }
        
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: err.response?.status || 500 });
    }
}

