
import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from 'axios';
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;

  // console.log('🔄 Update token endpoint called');
  // console.log('Token received:', token ? 'Present' : 'Missing');

  if (!token) {
    console.error('❌ No token provided to update-token endpoint');
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    // Set cookie using `cookies()` API
    (await cookies()).set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    console.log('✅ Token cookie updated successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to update token cookie:', error);
    return NextResponse.json({ error: 'Failed to update token' }, { status: 500 });
  }
}