import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { handleTokenExpiration } from "@/utils/serverErrorHandler";
import { createResponseWithHeaders } from "@/utils/headerUtils";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL(req.url);
        const branchId = url.searchParams.get('branchId') || '';
     
        const response = await axios.get(`${process.env.API_URL}/api/v1/dashboard/graph-data/${branchId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return await createResponseWithHeaders(response.data, response);
    } catch (error) {
        const err = error as AxiosError;

        // Check for token expiration in POST method
        if (err.response?.headers && err.response.headers['x-token-expired']) {
            console.log('Token expired detected in POST, initiating logout process');
            return await handleTokenExpiration();
        }

        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';

        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: 401 });
    }
}
