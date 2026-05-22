import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await axios.get(`${process.env.API_URL}/api/v1/admin/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return await createResponseWithHeaders(response.data, response);
    } catch (error) {
        const err = error as AxiosError;

        if (err.response?.headers?.['x-token-expired']) {
            return handleTokenExpiration();
        }

        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Internal Server Error';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}
