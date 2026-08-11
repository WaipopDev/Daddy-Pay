'use client';
import TableComponent from '@/components/Table/Table';
import { useAppSelector } from '@/store/hook';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import ModalActionDelete from '@/components/Modals/ModalActionDelete';
import { ShopManagementAdd, ShopManagementEdit } from '@/components/ShopManagement';
import { useMasterShopList } from '@/hooks/useMasterData';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface ItemDataProps {
    id: string;
    shopManagementName: string;
    shopManagementKey: string;
    shopManagementMachineID: string;
    shopManagementIotID: string;
    shopManagementIntervalTime: number;
    shopManagementStatus: string;
    machineInfo:{
        id          : string;
        machineBrand: string;
        machineType : string;
        machineModel: string;
        machineKey  : string;
    }
    shopInfo:{
        id: string;
        shopName: string;
    }
}

const ShopManagementPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();

    const [page, setPage] = useState({ page: 1, totalPages: 1 });
    const [item, setItem] = useState<ItemDataProps[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState('');
    const [showModalDelete, setShowModalDelete] = useState({ isShow: false, id: '' });
    const { itemShop } = useMasterShopList();
    const [valueShop, setValueShop] = useState('');
    const shopOptions = itemShop.map((item) => ({
        label: item.shopName,
        value: item.id,
    }));

    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            const response = await axios.get(`/api/shop-management?page=${pageNumber}&shopId=${valueShop === 'all' ? '' : valueShop}&search=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setItem(response.data.items);
                setPage({ page: response.data.meta.currentPage, totalPages: response.data.meta.totalPages });
            }
        } catch (error) {
            console.error("Error fetching shop info:", error);
        }
    }, [valueShop]);

    

    

    // useEffect(() => {
    //     fetchData();
    // }, [fetchData]);

    useEffect(() => {
        fetchData(1, '');
    }, [valueShop]);

    const handleOpenMachine = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleOpenEditModal = (id: string) => {
        setEditId(id);
        setShowEditModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditId('');
    }

    const handleSuccess = () => {
        fetchData(page.page);
    }

    const handleDeleteMachine = async (id: string) => {
        try {
            const response = await axios.delete(`/api/shop-management?shopManagementId=${id}`);
            if (response.status === 200) {
                setShowModalDelete({ isShow: false, id: '' });
                fetchData(page.page); // Refresh the data after deletion
            }
        } catch (error) {
            console.error("Error deleting machine:", error);
        }
    };
    return (
        <main className="bg-white p-2 md:p-4">
            <div className="flex border-b border-gray-300 pb-2 mb-4">
                <Col>
                    <Form.Group className="w-full">
                        <Form.Label className="text-sm md:text-base">{lang['filter_report_shop']}</Form.Label>
                        <SearchableDropdown
                            items={shopOptions}
                            value={valueShop}
                            onChange={setValueShop}
                            placeholder={lang['global_select']}
                            searchPlaceholder={lang['global_search']}
                        />
                    </Form.Group>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={() => handleOpenMachine()} className="w-full md:w-auto">
                        <i className="fa-solid fa-plus pr-2"></i>{lang['page_shop_management_add']}
                    </Button>
                </Col>
            </div>
            <Suspense fallback={<p>Loading feed...</p>}>
                <TableComponent
                    head={[
                        '#',
                        lang['page_shop_management_shop_name'],
                        lang['page_shop_management_machine_name'],
                        lang['page_shop_management_shop_management_key'],
                        lang['page_shop_management_machine_id'],
                        lang['page_shop_management_iot_id'],
                        lang['page_machine_info_machine_type'],
                        lang['global_status'],
                        lang['global_action'],
                    ]}
                    page={page.page}
                    totalPages={page.totalPages}
                    handleActive={(number: number) => fetchData(number)}
                >
                    {
                        item && (item.length ? item.map((item: ItemDataProps, index: number) => (
                            <tr key={index}>
                                <td className="text-center">{((page.page - 1) * 50) + (index + 1)}</td>
                                <td className="text-xs md:text-sm">{item.shopInfo.shopName}</td>
                                <td className="text-xs md:text-sm">
                                    <Link
                                        href={`/shop-management/transaction/${item.id}`}
                                        className="text-blue-500 hover:text-blue-700 hover:underline"
                                    >
                                        {item.shopManagementName}
                                    </Link>
                                </td>
                                <td className="text-xs md:text-sm">{item.shopManagementKey || '-'}</td>
                                <td className="text-xs md:text-sm">{item.shopManagementMachineID}</td>
                                <td className="text-xs md:text-sm">{item.shopManagementIotID}</td>
                                <td className="text-xs md:text-sm">{item.machineInfo?.machineType || '-'}</td>
                                <td><div className="flex justify-center text-xs md:text-sm">{item.shopManagementStatus}</div></td>
                                <td>
                                    <div className="flex gap-1 justify-center">
                                        <Button variant="warning" size="sm" onClick={() => handleOpenEditModal(item.id)}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}>
                                            <i className="fa-solid fa-trash"></i>
                                        </Button>
                                        <Button variant="info" size="sm" onClick={() => router.push(`/shop-management/program/${item.id}`)}>
                                            <i className="fa-solid fa-gear"></i>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={9} className="text-center text-xs md:text-sm">{lang['global_no_data']}</td>
                            </tr>
                        ))
                    }
                </TableComponent>
            </Suspense>
            <ShopManagementAdd
                show={showModal}
                handleClose={handleCloseModal}
                onSuccess={handleSuccess}
            />
            <ShopManagementEdit
                show={showEditModal}
                handleClose={handleCloseEditModal}
                onSuccess={handleSuccess}
                editId={editId}
            />
            <ModalActionDelete
                show={showModalDelete.isShow}
                handleClose={() => setShowModalDelete({ isShow: false, id: '' })}
                title={lang['page_shop_management_deleting_machine']}
                text={lang['global_delete_confirmation']}
                id={showModalDelete.id}
                handleConfirm={(id) => handleDeleteMachine(id)}
            />
        </main>
    )
}

export default ShopManagementPage