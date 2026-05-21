import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';
import {
    isSubscriptionStatus,
    SUBSCRIPTION_NOTIFICATION_CYCLE,
} from '@/constants/shopInfo';

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
        const {
            subSubscriptionStatus,
            subRegistrationDate,
            subExpirationDate,
            subNotificationCycle,
            subNotifyToEmail,
        } = body;

        if (
            !subSubscriptionStatus ||
            !subRegistrationDate ||
            !subExpirationDate ||
            subNotificationCycle === undefined ||
            subNotificationCycle === null ||
            !subNotifyToEmail
        ) {
            return NextResponse.json(
                {
                    message:
                        'subSubscriptionStatus, subRegistrationDate, subExpirationDate, subNotificationCycle, and subNotifyToEmail are required',
                },
                { status: 400 }
            );
        }

        if (!isSubscriptionStatus(subSubscriptionStatus)) {
            return NextResponse.json(
                { message: 'subSubscriptionStatus must be active or expired' },
                { status: 400 }
            );
        }

        const cycle = Number(subNotificationCycle);
        if (
            !Number.isInteger(cycle) ||
            cycle < SUBSCRIPTION_NOTIFICATION_CYCLE.MIN ||
            cycle > SUBSCRIPTION_NOTIFICATION_CYCLE.MAX
        ) {
            return NextResponse.json(
                {
                    message: `subNotificationCycle must be between ${SUBSCRIPTION_NOTIFICATION_CYCLE.MIN} and ${SUBSCRIPTION_NOTIFICATION_CYCLE.MAX}`,
                },
                { status: 400 }
            );
        }

        const encodedId = encodeURIComponent(id);
        const response = await axios.patch(
            `${process.env.API_URL}/api/v1/shop-info/subscription/${encodedId}`,
            {
                subSubscriptionStatus,
                subRegistrationDate,
                subExpirationDate,
                subNotificationCycle: cycle,
                subNotifyToEmail,
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
            'Failed to update subscription';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}
