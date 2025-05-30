
import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from 'axios';
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  // Set cookie using `cookies()` API
  (await cookies()).set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });

  return NextResponse.json({ success: true });
}