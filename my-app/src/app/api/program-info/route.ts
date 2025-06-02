import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { cookies } from "next/headers";
import { handleTokenExpiration } from "@/utils/serverErrorHandler";
import { createResponseWithHeaders } from "@/utils/headerUtils";

export async function POST(_request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const body = await _request.json();
        const { machineType, machineBrand, programName, programDescription } = body;
        if (!machineType || !machineBrand || !programName) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }
        
        const params = {
            machineId: machineBrand,
            programName,
            programDescription
        }

        const response = await axios.post(`${process.env.API_URL}/api/v1/program-info`, params, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return await createResponseWithHeaders(
                { message: 'Program information updated successfully' }, 
                response, 
                200
            );
        } else {
            return NextResponse.json({ message: 'Failed to update program information' }, { status: 401 });
        }
    } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)

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

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL(req.url);
        const page = url.searchParams.get('page') || '1';
        const response = await axios.get(`${process.env.API_URL}/api/v1/program-info?page=${page}&limit=10&column=programName&sort=ASC`, {
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

export async function DELETE(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL(req.url);
        const programId = url.searchParams.get('programId');
        if (!programId) {
            return NextResponse.json({ message: 'Program ID is required' }, { status: 400 });
        }
        const response = await axios.delete(`${process.env.API_URL}/api/v1/program-info/${programId}`, {
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