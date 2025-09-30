import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { cookies } from "next/headers";
import { handleTokenExpiration } from "@/utils/serverErrorHandler";
import { createResponseWithHeaders } from "@/utils/headerUtils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }
        const body = await req.json();
        const { consumerId, consumerSecret, partnerId, merchantId, partnerSecret, bankActiveName, bankActiveId } = body;
        if (!consumerId || !consumerSecret || !partnerId || !merchantId || !partnerSecret) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }
        const settingParams = {
            bankActiveName: bankActiveName,
            bankActiveId: bankActiveId || null,
            bankActiveParam: {
                bankActiveName: bankActiveName,
                consumerId,
                consumerSecret,
                partnerId,
                merchantId,
                partnerSecret
            },
            
        }
       
        const response = await axios.post(`${process.env.API_URL}/api/v1/shop-info/bank/${id}`, settingParams, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('response.status ', response.status )
        if (response.status === 200 || response.status === 201) {
            return await createResponseWithHeaders(response.data, response);
        }
        return NextResponse.json({ message: 'Bank information updated successfully' }, { status: 401 });
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }
        const response = await axios.get(`${process.env.API_URL}/api/v1/shop-info/bank/${id}`, {
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
