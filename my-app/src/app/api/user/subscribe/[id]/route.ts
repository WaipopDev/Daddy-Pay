import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const body = await req.json();
        const { subscribe, subscribeStartDate, subscribeEndDate } = body;

        if (subscribe === undefined || subscribe === null) {
            return NextResponse.json(
                { message: 'subscribe is required' },
                { status: 400 }
            );
        }

        if (typeof subscribe !== 'boolean') {
            return NextResponse.json(
                { message: 'subscribe must be a boolean' },
                { status: 400 }
            );
        }

        if (subscribe && (!subscribeStartDate || !subscribeEndDate)) {
            return NextResponse.json(
                {
                    message:
                        'subscribeStartDate and subscribeEndDate are required when subscribe is true',
                },
                { status: 400 }
            );
        }

        const encodedId = encodeURIComponent(id);
        const response = await axios.patch(
            `${process.env.API_URL}/api/v1/user/subscribe/${encodedId}`,
            {
                subscribe,
                subscribeStartDate: subscribeStartDate || null,
                subscribeEndDate: subscribeEndDate || null,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return await createResponseWithHeaders(response.data, response);
    } catch (error) {
        const err = error as AxiosError;

        if (err.response?.headers?.['x-token-expired']) {
            return handleTokenExpiration();
        }

        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Failed to update user subscription';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}
