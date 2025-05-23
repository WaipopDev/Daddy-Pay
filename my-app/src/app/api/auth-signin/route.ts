
import { NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';

export async function POST(_request: Request) {
    try {
        const body = await _request.json();
        const { username, password } = body;
        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 401 });
        }

        const response = await axios.post(`${process.env.API_URL}/api/v1/admin/auth/signin`, { email: username, password });

        if (response.status === 200) {
            const { accessToken } = response.data;
            if(!accessToken) {
                return NextResponse.json({ message: 'Token not found in response' }, { status: 401 });
            }
            const res = NextResponse.json({ message: 'Login successful' }, { status: 200 });
            res.cookies.set('token', accessToken, { path: '/', httpOnly: true });
            return res;
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        const err = error as AxiosError;
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        return NextResponse.json({ message: errorMessage|| 'Internal Server Error' }, { status: 401 });
    }
}