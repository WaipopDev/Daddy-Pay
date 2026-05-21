import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';

export async function GET(
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

        const startDate = req.nextUrl.searchParams.get('startDate');
        const endDate = req.nextUrl.searchParams.get('endDate');
        const page = req.nextUrl.searchParams.get('page') || '1';
        const limit = req.nextUrl.searchParams.get('limit') || '50';

        if (!startDate || !endDate) {
            return NextResponse.json(
                { message: 'startDate and endDate are required' },
                { status: 400 }
            );
        }

        const encodedId = encodeURIComponent(id);
        const query = new URLSearchParams({
            startDate,
            endDate,
            page,
            limit,
        });

        const response = await axios.get(
            `${process.env.API_URL}/api/v1/shop-management/${encodedId}/transactions?${query.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return await createResponseWithHeaders(response.data, response);
    } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
            return handleTokenExpiration();
        }
        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Failed to fetch transactions';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}
