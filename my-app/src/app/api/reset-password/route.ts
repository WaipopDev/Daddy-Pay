import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const token = typeof body.token === 'string' ? body.token.trim() : '';
        const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

        if (!token) {
            return NextResponse.json({ message: 'Reset token is required' }, { status: 400 });
        }

        if (!newPassword) {
            return NextResponse.json({ message: 'New password is required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: 'New password must be at least 6 characters' }, { status: 400 });
        }

        const response = await axios.post(
            `${process.env.API_URL}/api/v1/admin/auth/reset-password`,
            { token, newPassword }
        );

        const message =
            (response.data as { message?: string })?.message ||
            'Password has been reset successfully.';

        return NextResponse.json({ message }, { status: response.status });
    } catch (error) {
        const err = error as AxiosError;
        const status = err.response?.status || 500;
        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Failed to reset password. The link may be invalid or expired.';

        return NextResponse.json({ message: errorMessage }, { status });
    }
}
