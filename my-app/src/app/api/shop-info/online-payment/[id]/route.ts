import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';
import { isOnlinePaymentStatus } from '@/constants/shopInfo';

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
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        const body = await req.json();
        const { onlinePaymentStatus, onlineActivationDate, onlineCloseDate } = body;

        if (!onlinePaymentStatus || !onlineActivationDate || !onlineCloseDate) {
            return NextResponse.json(
                { message: 'onlinePaymentStatus, onlineActivationDate, and onlineCloseDate are required' },
                { status: 400 }
            );
        }

        if (!isOnlinePaymentStatus(onlinePaymentStatus)) {
            return NextResponse.json(
                { message: 'onlinePaymentStatus must be enable or disable' },
                { status: 400 }
            );
        }

        const encodedId = encodeURIComponent(id);
        const response = await axios.patch(
            `${process.env.API_URL}/api/v1/shop-info/online-payment/${encodedId}`,
            {
                onlinePaymentStatus,
                onlineActivationDate,
                onlineCloseDate,
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
            'Failed to update online payment';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}
