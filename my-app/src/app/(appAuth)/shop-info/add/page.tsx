'use client';
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Button, Col, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ShopInfoForm from "@/components/ShopInfoForm/ShopInfoForm";
import axios from "axios";
import { openModalAlert, setProcess } from "@/store/features/modalSlice";
import { useErrorHandler } from "@/store/useErrorHandler";

const ShopInfoAddPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();
     
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        
        const form = event.currentTarget;
        setValidated(true);
        
        if (form.checkValidity() === false) {
            return;
        }
        dispatch(setProcess(true));
        const formData = new FormData(form);
        // const data = {
        //     shopCode             : formData.get('shopCode'),
        //     shopName             : formData.get('shopName'),
        //     shopAddress          : formData.get('shopAddress'),
        //     shopContactInfo      : formData.get('shopContactInfo'),
        //     shopMobilePhone      : formData.get('shopMobilePhone'),
        //     shopEmail            : formData.get('shopEmail'),
        //     shopLatitude         : formData.get('shopLatitude'),
        //     shopLongitude        : formData.get('shopLongitude'),
        //     shopStatus           : formData.get('shopStatus'),
        //     shopSystemName       : formData.get('shopSystemName'),
        //     shopUploadFile       : formData.get('shopUploadFile'),
        //     shopTaxName          : formData.get('shopTaxName'),
        //     shopTaxId            : formData.get('shopTaxId'),
        //     shopTaxAddress       : formData.get('shopTaxAddress'),
        //     shopBankAccount      : formData.get('shopBankAccount'),
        //     shopBankAccountNumber: formData.get('shopBankAccountNumber'),
        //     shopBankName         : formData.get('shopBankName'),
        //     shopBankBranch       : formData.get('shopBankBranch'),
        // };
        
        try {
            await axios.post('/api/shop-info', formData);

        } catch (error) {
            handleError(error);
            // Error handling - form stays on page, no reload
        } finally{
            dispatch(setProcess(false));
        }
    };


    const handleCancel = () => {
        router.push('/shop-info');
    };
    return (
        <main className="bg-white p-2">
             <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="flex  pb-2">
                    <Col className="flex justify-end">
                        <Button variant="primary" type="submit"><i className="fa-solid fa-floppy-disk pr-2"></i>{lang['button_save']}</Button>
                        <Button variant="secondary" onClick={() => handleCancel()} className="ml-2"><i className="fa-solid fa-xmark pr-2"></i>{lang['button_cancel']}</Button>
                    </Col>
                </div>
                <ShopInfoForm />
            </Form>
        </main>
    )
}

export default ShopInfoAddPage