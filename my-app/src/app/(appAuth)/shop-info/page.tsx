'use client';
import React from "react";
import PageNoData from "@/components/PageNoData";
import { useAppSelector } from "@/store/hook";
import { Button, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";

const ShopInfoPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();

    const handleAddShop = () => {
        // Logic to add a new shop
        console.log("Add new shop clicked");
        router.push('/shop-info/add');
    };
    return (
        <main className="bg-white p-2">
            <div className="flex border-b border-gray-300 pb-2">
                <Col className="flex justify-start">

                </Col>
                <Col className="flex justify-end">
                    <Button variant="primary" onClick={() => handleAddShop()}><i className="fa-solid fa-plus pr-2"></i>{lang['button_add_shop']}</Button>
                </Col>
            </div>
            <PageNoData />
        </main>
    )
}

export default ShopInfoPage