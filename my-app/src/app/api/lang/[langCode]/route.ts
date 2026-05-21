import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';

const validateTranslations = (translations: unknown) => {
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
        return 'Translations are required';
    }
    if (Object.keys(translations).length === 0) {
        return 'Translations cannot be empty';
    }
    return null;
};

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ langCode: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { langCode } = await context.params;
        const code = langCode?.trim();
        if (!code) {
            return NextResponse.json({ message: 'Language code is required' }, { status: 400 });
        }

        const body = await request.json();
        const langName = typeof body.langName === 'string' ? body.langName.trim() : '';
        const translations = body.translations;

        if (!langName) {
            return NextResponse.json({ message: 'Language name is required' }, { status: 400 });
        }

        const translationsError = validateTranslations(translations);
        if (translationsError) {
            return NextResponse.json({ message: translationsError }, { status: 400 });
        }

        const response = await axios.patch(
            `${process.env.API_URL}/api/v1/language/${encodeURIComponent(code)}`,
            { langName, translations },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const message =
            (response.data as { message?: string })?.message ||
            'Language updated successfully';

        return await createResponseWithHeaders({ message }, response);
    } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
            return handleTokenExpiration();
        }
        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Failed to update language';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ langCode: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { langCode } = await context.params;
        const code = langCode?.trim();
        if (!code) {
            return NextResponse.json({ message: 'Language code is required' }, { status: 400 });
        }

        const response = await axios.delete(
            `${process.env.API_URL}/api/v1/language/${encodeURIComponent(code)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const message =
            (response.data as { message?: string })?.message ||
            'Language deleted successfully';

        return await createResponseWithHeaders({ message }, response);
    } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
            return handleTokenExpiration();
        }
        const errorMessage =
            (err.response?.data as { message?: string })?.message ||
            'Failed to delete language';
        return NextResponse.json(
            { message: errorMessage },
            { status: err.response?.status || 500 }
        );
    }
}
