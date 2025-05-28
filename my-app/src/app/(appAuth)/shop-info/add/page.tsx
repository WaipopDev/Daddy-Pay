'use client';
import React from "react";
import { useAppSelector } from "@/store/hook";
import { Button, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ShopInfoFrom from "@/components/ShopInfoFrom/ShopInfoFrom";

const ShopInfoAddPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();

    const handleAddShop = () => {
    };

    const handleCancel = () => {
        router.push('/shop-info');
    };
    return (
        <main className="bg-white p-3">
            <div className="flex border-b border-gray-300 pb-3">
                <Col className="flex justify-end">
                    <Button variant="primary" onClick={() => handleAddShop()}><i className="fa-solid fa-floppy-disk pr-2"></i>{lang['button_save']}</Button>
                    <Button variant="secondary" onClick={() => handleCancel()} className="ml-2"><i className="fa-solid fa-xmark pr-2"></i>{lang['button_cancel']}</Button>
                </Col>
            </div>
            <ShopInfoFrom />
        </main>
    )
}

export default ShopInfoAddPage