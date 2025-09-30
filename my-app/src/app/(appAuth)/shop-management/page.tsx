'use client';
import TableComponent from '@/components/Table/Table';
import { useAppSelector } from '@/store/hook';
import { useRouter } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Button, Col } from 'react-bootstrap';
import axios from 'axios';

import ModalActionDelete from '@/components/Modals/ModalActionDelete';
import { ShopManagementAdd, ShopManagementEdit } from '@/components/ShopManagement';
import _ from 'lodash';

interface ItemDataProps {
    id: string;
    shopManagementName: string;
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

// interface MachineDataProps {
//     id: string;
//     machineKey: string;
//     machineType: string;
//     machineBrand: string;
//     machineModel: string;
// }

const ShopManagementPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();

    const [page, setPage] = useState({ page: 1, totalPages: 1 });
    const [item, setItem] = useState<ItemDataProps[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState('');
    const [showModalDelete, setShowModalDelete] = useState({ isShow: false, id: '' });
    // const [itemMachine, setItemMachine] = useState<MachineDataProps[][] | null>(null);
    // const [activeShopType, setActiveShopType] = useState('');
    // console.log("🚀 ~ ShopManagementPage ~ activeMachineType:", itemShop)

    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            const response = await axios.get(`/api/shop-management?page=${pageNumber}&search=${search}`, {
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
    }, []);

    

    

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
        <main className="bg-white p-2">
            <div className="flex border-b border-gray-300 pb-2">
                <Col className="flex justify-start">

                </Col>
                <Col className="flex justify-end">
                    <Button variant="primary" onClick={() => handleOpenMachine()}><i className="fa-solid fa-plus pr-2"></i>{lang['page_shop_management_add']}</Button>
                </Col>
            </div>
            <Suspense fallback={<p>Loading feed...</p>}>
                <TableComponent
                    head={[
                        '#',
                        lang['page_shop_management_shop_name'],
                        lang['page_shop_management_machine_name'],
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
                                <td>{(page.page - 1) * 10 + index + 1}</td>
                                <td>{item.shopInfo.shopName}</td>
                                <td>{item.shopManagementName}</td>
                                <td>{item.shopManagementMachineID}</td>
                                <td>{item.shopManagementIotID}</td>
                                <td>{item.machineInfo.machineType}</td>
                                <td><div className="flex justify-center">{item.shopManagementStatus}</div></td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleOpenEditModal(item.id)}><i className="fa-solid fa-pen-to-square"></i></Button>
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}><i className="fa-solid fa-trash"></i></Button>
                                    <Button variant="info" size="sm" className="ml-2" onClick={() => router.push(`/shop-management/program/${item.id}`)}><i className="fa-solid fa-gear"></i></Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={8} className="text-center">{lang['global_no_data']}</td>
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
                // onSuccess={handleSuccess}
                editId={editId}
            />
            <ModalActionDelete
                show={showModalDelete.isShow}
                handleClose={() => setShowModalDelete({ isShow: false, id: '' })}
                title={lang['page_machine_info_deleting']}
                text={lang['global_delete_confirmation']}
                id={showModalDelete.id}
                handleConfirm={(id) => handleDeleteMachine(id)}
            />
        </main>
    )
}

export default ShopManagementPage