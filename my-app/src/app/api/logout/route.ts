
import { NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';

export async function GET() {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set('token', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0,
    });

    return response;
}