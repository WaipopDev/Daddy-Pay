'use client';
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hook";
import { Button, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";
import TableComponent from "@/components/Table/Table";
import axios from "axios";
import ModalActionDelete from "@/components/Modals/ModalActionDelete";

interface ItemDataProps {
    id: string;
    shopCode: string;
    shopName: string;
    shopStatus: string;
    shopContactInfo: string;
    shopMobilePhone: string;
}

const ShopInfoPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();
    
    const [page, setPage] = useState({ page: 1, totalPages: 1 });
    const [item, setItem] = useState<ItemDataProps[] | null>(null);
    const [showModalDelete, setShowModalDelete] = useState({ isShow: false, id: '' });
    // const [selectedItem, setSelectedItem] = useState<ItemDataProps | null>(null);

    const fetchData = useCallback(async (pageNumber: number = 1,search: string = '') => {
        try {
            const response = await axios.get(`/api/shop-info?page=${pageNumber}&search=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.status === 200) {
                setItem(response.data.items);
                setPage({ page: response.data.meta.currentPage, totalPages: response.data.meta.totalPages });
            }
        } catch (error) {
            console.error("Error fetching shop info:", error);
        }
    }, []);

    useEffect(() => {
       fetchData();
    }, [fetchData]);

    const handleAddShop = () => {
        // Logic to add a new shop
        console.log("Add new shop clicked");
        router.push('/shop-info/add');
    };

    const handleDeleteShop = async (id: string) => {
        try {
            const response = await axios.delete(`/api/shop-info?shopId=${id}`);
            if (response.status === 200) {
                setShowModalDelete({ isShow: false, id: '' });
                fetchData(page.page); // Refresh the data after deletion
            }
        } catch (error) {
            console.error("Error deleting shop:", error);
        }
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
            <Suspense fallback={<p>Loading feed...</p>}>
                <TableComponent
                    head={[
                        '#', 
                        lang['page_shop_info_shop_code'], 
                        lang['page_shop_info_shop_name'], 
                        lang['global_status'], 
                        lang['page_shop_info_online_payment_status'],
                        lang['page_shop_info_registration_date'],
                        lang['page_shop_info_expiration_date'],
                        lang['page_shop_info_subscription_status'],
                        lang['page_shop_info_contact_info'],
                        lang['page_shop_info_contact_number'],
                        lang['global_action'],
                    ]}
                    page={page.page}
                    totalPages={page.totalPages}
                    handleActive={(number: number) => fetchData(number)}
                >
                    {
                        item && (item.length ? item.map((item: ItemDataProps, index: number) => (
                            <tr key={index}>
                                <td>{(page.page - 1) * 10 + index + 1}</td>
                                <td>{item.shopCode}</td>
                                <td>{item.shopName}</td>
                                <td>{item.shopStatus === 'active' ? <span className="text-success">{lang['global_active']}</span> : <span className="text-danger">{lang['global_inactive']}</span>}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>{item.shopContactInfo}</td>
                                <td>{item.shopMobilePhone}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => router.push(`/shop-info/edit/${item.id}`)}><i className="fa-solid fa-pen-to-square"></i></Button>
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}><i className="fa-solid fa-trash"></i></Button>
                                </td>
                            </tr>
                        ))
                            :
                            <tr>
                                <td colSpan={7} className="text-center">{'ไม่มีข้อมูล'}</td>
                            </tr>
                        )
                    }
                </TableComponent>
            </Suspense>
            <ModalActionDelete
                show={showModalDelete.isShow}
                handleClose={() => setShowModalDelete({ isShow: false, id: '' })}
                title={lang['page_shop_info_deleting']}
                text={lang['global_delete_confirmation']}
                id={showModalDelete.id}
                handleConfirm={(id) => handleDeleteShop(id)}
             />
        </main>
    )
}

export default ShopInfoPage