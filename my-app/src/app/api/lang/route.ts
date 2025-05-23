
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const langCode = req.nextUrl.searchParams.get('langCode') || 'en'
        if (!langCode) {
            return NextResponse.json({ message: 'Language code is required' }, { status: 400 });
        }
        const response = await axios.get(`${process.env.API_URL}/api/v1/language?labgCode=${langCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return NextResponse.json(response.data);
    } catch (error) {
        const err = error as AxiosError;
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: 401 });
    }
}