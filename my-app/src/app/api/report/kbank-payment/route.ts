
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { handleTokenExpiration } from "@/utils/serverErrorHandler";
import { createResponseWithHeaders } from "@/utils/headerUtils";

export async function GET(req: NextRequest) {
    try {
        const token       = req.cookies.get('token')?.value;
        const url         = new URL(req.url);
        const branchId    = url.searchParams.get('branchId') || '';
        const startDate   = url.searchParams.get('startDate') || '';
        const endDate     = url.searchParams.get('endDate') || '';
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
   
        const response = await axios.get(`${process.env.API_URL}/api/v1/report/kbank-payment`, {
            params: {
                branchId,
                startDate,
                endDate
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await createResponseWithHeaders(response.data, response);
    } catch (error) {
        const err = error as AxiosError;
        // console.log('err', err.response)
        if (err.response?.headers && err.response.headers['x-token-expired']) {
            console.log('Token expired detected in POST, initiating logout process');
            return await handleTokenExpiration();
        }
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: 401 });
    }
}