import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { handleTokenExpiration } from "@/utils/serverErrorHandler";
import { createResponseWithHeaders } from "@/utils/headerUtils";

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
        const response = await axios.get(`${process.env.API_URL}/api/v1/shop-management/${id}`, {
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }
        
        const body = await req.json();
        const { shopId, machineType, machineModel, machineName, machineID, machineIotId, machineIntervalTime } = body;
        
        if (!machineType || !machineModel || !machineName || !machineID || !machineIotId || !machineIntervalTime) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }
        
        const params_update = {
            shopId,
            machineId                 : machineModel,
            shopManagementName        : machineName,
            shopManagementDescription : '',
            shopManagementMachineID   : machineID,
            shopManagementIotID       : machineIotId,
            shopManagementIntervalTime : Number(machineIntervalTime)
        }

        const response = await axios.patch(`${process.env.API_URL}/api/v1/shop-management/${id}`, params_update, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return await createResponseWithHeaders(
                { message: 'Shop management updated successfully' }, 
                response, 
                200
            );
        } else {
            return NextResponse.json({ message: 'Failed to update shop management' }, { status: 401 });
        }
    } catch (error) {
        const err = error as AxiosError;

        // Check for token expiration in PATCH method
        if (err.response?.headers && err.response.headers['x-token-expired']) {
            console.log('Token expired detected in PATCH, initiating logout process');
            return await handleTokenExpiration();
        }

        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';

        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: 401 });
    }
}
