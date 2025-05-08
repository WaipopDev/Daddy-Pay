
import { NextResponse } from "next/server";
import axios from 'axios';

export async function POST(_request: Request) {
    try {
        const body = await _request.json();
        const { username, password } = body;
        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }
        const response = await axios.post(`${process.env.API_URL}/v1/admin/auth/signin`, { username, password });

        if (response.status === 200) {
            const { token } = response.data;
            const res = NextResponse.json({ message: 'Login successful' }, { status: 200 });
            res.cookies.set('token', token, { path: '/', httpOnly: true });
            return res;
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }
    } catch (error) {
        console.error('🚀 ~ API error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 400 });
    }
}