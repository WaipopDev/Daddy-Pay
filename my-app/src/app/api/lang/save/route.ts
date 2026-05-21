import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const langCode = typeof body.langCode === 'string' ? body.langCode.trim() : '';
        const langName = typeof body.langName === 'string' ? body.langName.trim() : '';
        const translations = body.translations;

        if (!langCode) {
            return NextResponse.json({ message: 'Language code is required' }, { status: 400 });
        }
        if (!langName) {
            return NextResponse.json({ message: 'Language name is required' }, { status: 400 });
        }
        if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
            return NextResponse.json({ message: 'Translations are required' }, { status: 400 });
        }
        if (Object.keys(translations).length === 0) {
            return NextResponse.json({ message: 'Translations cannot be empty' }, { status: 400 });
        }

        const payload = {
            langCode,
            langName,
            translations,
        };

        const response = await axios.post(
            `${process.env.API_URL}/api/v1/language/save`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const message =
            (response.data as { message?: string })?.message ||
            'Language saved successfully';

        return await createResponseWithHeaders({ message }, response);
    } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
            return handleTokenExpiration();
        }
        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Failed to save language';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}
