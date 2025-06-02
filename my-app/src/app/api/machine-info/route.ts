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
        const formData = await _request.formData();
        // ดึงค่าจาก FormData
        const machineType = formData.get('machineType') as string;
        const machineBrand = formData.get('machineBrand') as string;
        const machineModel = formData.get('machineModel') as string;
        const machineDescription = formData.get('machineDescription') as string;
        const machinePicture = formData.get('machinePicture') as File;

        if (!machineType || !machineBrand || !machineModel) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        // Validate file
        if (!machinePicture || machinePicture.size === 0) {
            return NextResponse.json({ message: 'Invalid or empty file' }, { status: 400 });
        }
        const apiFormData = new FormData();
        apiFormData.append('machineType', machineType);
        apiFormData.append('machineBrand', machineBrand);
        apiFormData.append('machineModel', machineModel);
        apiFormData.append('machineDescription', machineDescription);
        apiFormData.append('machinePictureFile', machinePicture);

        const response = await axios.post(`${process.env.API_URL}/api/v1/machine-info`, apiFormData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            return await createResponseWithHeaders(
                { message: 'Machine information updated successfully' }, 
                response, 
                200
            );
        } else {
            return NextResponse.json({ message: 'Failed to update machine information' }, { status: 401 });
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

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL(req.url);
        const page = url.searchParams.get('page') || '1';
        const response = await axios.get(`${process.env.API_URL}/api/v1/machine-info?page=${page}&limit=10&column=machineType&sort=ASC`, {
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