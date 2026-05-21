import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = typeof body.email === 'string' ? body.email.trim() : '';

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
        }

        const response = await axios.post(
            `${process.env.API_URL}/api/v1/admin/auth/forgot-password`,
            { email }
        );

        const message =
            (response.data as { message?: string })?.message ||
            'If this email is registered, a password reset link has been sent.';

        return NextResponse.json({ message }, { status: response.status });
    } catch (error) {
        const err = error as AxiosError;
        const status = err.response?.status || 500;
        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Failed to send reset email. Please try again.';

        return NextResponse.json({ message: errorMessage }, { status });
    }
}
