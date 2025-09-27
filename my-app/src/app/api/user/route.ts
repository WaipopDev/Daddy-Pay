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
        
        const formData = await _request.json();
        
        // ดึงค่าจาก FormData สำหรับ user
        const username  = formData.username as string;
        const email     = formData.email as string;
        const password  = formData.password as string;
        const role      = formData.role as string;
        const shopIds   = formData.shopIds as string[];
        const createdBy = formData.createdBy as string;
        if (!username || !email || !password || !role || !shopIds || shopIds.length === 0) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const userData = {
            username: username,
            email: email,
            password: password,
            role: role,
            createdBy: createdBy,
            shopIds: shopIds
        };

        const response = await axios.post(`${process.env.API_URL}/api/v1/user`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('response', response.status)
        if (response.status === 201) {
            return await createResponseWithHeaders(
                { message: 'User created successfully' }, 
                response, 
                200
            );
        } else {
            return NextResponse.json({ message: 'Failed to create user' }, { status: 401 });
        }
    } catch (error) {
        const err = error as AxiosError;
        console.log('err', err.response)
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
        const response = await axios.get(`${process.env.API_URL}/api/v1/user?page=${page}&limit=10&column=username&sort=ASC`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      
        
        return await createResponseWithHeaders(response.data, response);
    } catch (error) {
        const err = error as AxiosError;
            console.log('err', err)
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
        const userId = url.searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }
        const response = await axios.delete(`${process.env.API_URL}/api/v1/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return await createResponseWithHeaders(
            { message: 'User deleted successfully' },
            response,
            200
        );
    } catch (error) {
        const err = error as AxiosError;
        
        if (err.response?.headers && err.response.headers['x-token-expired']) {
            console.log('Token expired detected in DELETE, initiating logout process');
            return await handleTokenExpiration();
        }
        
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.json();
        
        // ดึงค่าจาก FormData สำหรับ user
        const id = formData.id as string;
        const username = formData.username as string;
        const email = formData.email as string;
        // const password = formData.password as string;
        const role = formData.role as string;
        const shopIds = formData.shopIds as string[];
        const updatedBy = formData.updatedBy as string;
        
        if (!id || !username || !email || !role || !shopIds || shopIds.length === 0) {
            return NextResponse.json({ message: 'All required fields must be provided' }, { status: 400 });
        }

        const userData: {
            username: string;
            email: string;
            role: string;
            updatedBy: string;
            shopIds: string[];
        } = {
            username: username,
            email: email,
            role: role,
            updatedBy: updatedBy,
            shopIds: shopIds
        };

    

        const response = await axios.patch(`${process.env.API_URL}/api/v1/user/${id}`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            return await createResponseWithHeaders(
                { message: 'User updated successfully' },
                response,
                200
            );
        } else {
            return NextResponse.json({ message: 'Failed to update user' }, { status: 401 });
        }
    } catch (error) {
        const err = error as AxiosError;
        console.log('err', err.response);
        
        // Check for token expiration
        if (err.response?.headers && err.response.headers['x-token-expired']) {
            console.log('Token expired detected in PUT, initiating logout process');
            return await handleTokenExpiration();
        }
        
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: 401 });
    }
}

