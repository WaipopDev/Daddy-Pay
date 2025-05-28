import React from "react";
import PageNoData from "@/components/PageNoData";
import { useAppSelector } from "@/store/hook";
import { Button, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";

const ShopInfoFrom = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();

    const handleAddShop = () => {
    };

    const handleCancel = () => {
        router.push('/shop-info');
    };
    return (
        <div className="">
        </div>
    )
}

export default ShopInfoFrom