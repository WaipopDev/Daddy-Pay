import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { handleTokenExpiration } from "@/utils/serverErrorHandler";
import { createResponseWithHeaders } from "@/utils/headerUtils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }
        const response = await axios.get(`${process.env.API_URL}/api/v1/machine-program/machine/${id}`, {
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }
        const response = await axios.delete(`${process.env.API_URL}/api/v1/machine-program/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return await createResponseWithHeaders(
                { message: 'Program information deleted successfully' },
                response,
                200
            );
        } else {
            return NextResponse.json({ message: 'Failed to delete program information' }, { status: 401 });
        }
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