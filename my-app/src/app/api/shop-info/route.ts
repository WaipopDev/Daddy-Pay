
import { NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';
import { cookies } from "next/headers";

export async function POST(_request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const formData = await _request.formData();
                // ดึงค่าจาก FormData
        const shopCode = formData.get('shopCode') as string;
        const shopName = formData.get('shopName') as string;
        const shopStatus = formData.get('shopStatus') as string;
        const shopUploadFile = formData.get('shopUploadFile') as File;
        const shopSystemName = formData.get('shopSystemName') as string;
        const shopBankAccount = formData.get('shopBankAccount') as string;
        const shopBankAccountNumber = formData.get('shopBankAccountNumber') as string;
        const shopBankName = formData.get('shopBankName') as string;
        const shopBankBranch = formData.get('shopBankBranch') as string;

        if (!shopCode || !shopName || !shopStatus || !shopUploadFile || !shopSystemName || !shopBankAccount || !shopBankAccountNumber || !shopBankName || !shopBankBranch) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        // Validate file
        if (!shopUploadFile || shopUploadFile.size === 0) {
            return NextResponse.json({ message: 'Invalid or empty file' }, { status: 400 });
        }
        const apiFormData = new FormData();
        apiFormData.append('shopCode', shopCode);
        apiFormData.append('shopName', shopName);
        apiFormData.append('shopAddress', formData.get('shopAddress') as string || '');
        apiFormData.append('shopContactInfo', formData.get('shopContactInfo') as string || '');
        apiFormData.append('shopMobilePhone', formData.get('shopMobilePhone') as string || '');
        apiFormData.append('shopEmail', formData.get('shopEmail') as string || '');
        apiFormData.append('shopLatitude', formData.get('shopLatitude') as string || '');
        apiFormData.append('shopLongitude', formData.get('shopLongitude') as string || '');
        apiFormData.append('shopStatus', shopStatus);
        apiFormData.append('shopSystemName', shopSystemName);
        apiFormData.append('shopUploadFile', shopUploadFile);  // File data
        apiFormData.append('shopTaxName', formData.get('shopTaxName') as string || '');
        apiFormData.append('shopTaxId', formData.get('shopTaxId') as string || '');
        apiFormData.append('shopTaxAddress', formData.get('shopTaxAddress') as string || '');
        apiFormData.append('shopBankAccount', shopBankAccount);
        apiFormData.append('shopBankAccountNumber', shopBankAccountNumber);
        apiFormData.append('shopBankName', shopBankName);
        apiFormData.append('shopBankBranch', shopBankBranch);

        const response = await axios.post(`${process.env.API_URL}/api/v1/shop-info`, apiFormData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {

            const res = NextResponse.json({ message: 'Shop information updated successfully' }, { status: 200 });
            return res;
        } else {
            return NextResponse.json({ message: 'Failed to update shop information' }, { status: 401 });
        }
    } catch (error) {
     
        const err = error as AxiosError;
        const errorMessage = (err.response?.data as { message?: string })?.message || 'Internal Server Error';
        console.log("🚀 ~ POST ~ errorMessage:", err)
        return NextResponse.json({ message: errorMessage || 'Internal Server Error' }, { status: 401 });
    }
       
} 