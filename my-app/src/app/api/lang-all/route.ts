
import {  NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { createResponseWithHeaders } from "@/utils/headerUtils";

export async function GET() {
    try {
       
        const response = await axios.get(`${process.env.API_URL}/api/v1/language/all`);
        return await createResponseWithHeaders(response.data, response);
    } catch (error) {
        const err = error as AxiosError;
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: 401 });
    }
}