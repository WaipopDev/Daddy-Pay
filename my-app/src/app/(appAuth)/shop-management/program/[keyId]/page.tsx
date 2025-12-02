'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { openModalAlert, setProcess } from "@/store/features/modalSlice";
import { useErrorHandler } from "@/store/useErrorHandler";

import validateRequiredFields from "@/utils/validateRequiredFields";
import ModalActionDelete from "@/components/Modals/ModalActionDelete";
import ShopManagementProgramModal, { ShopManagementProgramFormData } from "@/components/ShopManagement/ShopManagementProgramModal";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableRow } from '@/components/Table/SortableRow';

export interface ItemDataProps {
    id: string;
    shopManagementName: string;
    shopManagementMachineID: string;
    shopManagementIotID: string;
    shopManagementIntervalTime: number;
    shopManagementStatus: string;
    machineInfo: {
        id: string;
        machineBrand: string;
        machineType: string;
        machineModel: string;
        machineKey: string;
    }
    shopInfo: {
        id: string;
        shopName: string;
    }
}

export interface defaultItemProgramDataProps {
    id: string;
    programName: string;
    programDescription: string;
    programKey: string;
}

interface ItemProgramDataProps {
    id: string;
    machineProgramKey: string;
    machineProgramPrice: string;
    machineProgramOperationTime: number;
    machineProgramStatus: string;
    sort: number;
    programInfo: {
        id: string;
        programName: string;
        programDescription: string;
    }
}

const ShopManagementProgramPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();
    const { keyId } = useParams();


    const [item, setItem] = useState<ItemDataProps | null>(null);
    const [itemProgram, setItemProgram] = useState<ItemProgramDataProps[] | []>([]);
    const [defaultItemProgram, setDefaultItemProgram] = useState<defaultItemProgramDataProps[] | []>([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState<{ isShow: boolean; id: string }>({ isShow: false, id: '' });
    // console.log('defaultItemProgram', defaultItemProgram)
    const fetchData = useCallback(async (keyId: string) => {
        try {
            dispatch(setProcess(true));
            const response = await axios.get(`/api/shop-management/by/${keyId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setItem(response.data);
            }
            dispatch(setProcess(false));
        } catch (error) {
            console.error("Error fetching shop info:", error);
            handleError(error);
            dispatch(setProcess(false));
        }
    }, [dispatch, handleError]);

    const fetchItemData = useCallback(async (idMachine: string, idShop: string) => {
        try {
            dispatch(setProcess(true));
            const response = await axios.get(`/api/shop-management/by/program?idMachine=${idMachine}&idShop=${idShop}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setItemProgram(response.data);
            }
            dispatch(setProcess(false));
        } catch (error) {
            console.error("Error fetching shop info:", error);
            handleError(error);
            dispatch(setProcess(false));
        }
    }, [dispatch, handleError]);

    const fetchProgramData = useCallback(async (keyId: string) => {
        try {
            dispatch(setProcess(true));
            const response = await axios.get(`/api/shop-management/by/program/${keyId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setDefaultItemProgram(response.data);
            }
            dispatch(setProcess(false));
        } catch (error) {
            console.error("Error fetching shop info:", error);
            handleError(error);
            dispatch(setProcess(false));
        }
    }, [dispatch, handleError]);

    useEffect(() => {
        fetchData(keyId as string);
    }, [fetchData, keyId]);

    useEffect(() => {
        if (item) {
            fetchProgramData(item.machineInfo.id);
            fetchItemData(item.machineInfo.id, item.shopInfo.id);
        }
    }, [item, fetchProgramData, fetchItemData]);
    const handleBack = () => {
        router.push('/shop-management');
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveProgram = async (data: ShopManagementProgramFormData) => {
        if (!item) {
            dispatch(openModalAlert({
                message: lang['global_error_message']
            }));
            return;
        }

        const { machineProgramID, programPrice, programOperationTime } = data;

        const message = validateRequiredFields([
            { value: machineProgramID, label: lang['page_shop_management_program'] },
            { value: programPrice, label: lang['global_price'] },
            { value: programOperationTime, label: lang['page_shop_management_operation_time'] },
        ]);
        if (message) {
            dispatch(openModalAlert({ message: `${lang['global_required_fields']}<br/>${message}` }));
            return;
        }


        try {
            dispatch(setProcess(true));
            const params = {
                machineProgramID,
                programPrice,
                programOperationTime,
                shopInfoId: item.shopInfo.id,
                machineInfoId: item.machineInfo.id,
            }

            await axios.post('/api/shop-management/by/program', params);

            setShowModal(false);
            fetchItemData(item.machineInfo.id, item.shopInfo.id);
            dispatch(setProcess(false));

            dispatch(openModalAlert({
                message: lang['global_add_success_message']
            }));
        } catch (error) {
            console.error('Error saving machine data:', error);
            handleError(error);
            dispatch(setProcess(false));
        }
    }

    const handleOpenAddProgram = () => {
        if (defaultItemProgram.length === 0) {
            dispatch(openModalAlert({
                message: lang['page_shop_management_no_program'],
            }));
            return;
        }
        setShowModal(true);
    }

    const handleDeleteProgram = async (id: string) => {
        if (!item) {
            dispatch(openModalAlert({
                message: lang['global_error_message']
            }));
            return;
        }
        try {
            dispatch(setProcess(true));
            const response = await axios.delete(`/api/shop-management/by/program/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                dispatch(openModalAlert({
                    message: lang['global_delete_success_message']
                }));
                fetchItemData(item.machineInfo.id, item.shopInfo.id);
            }
            setShowModalDelete({ isShow: false, id: '' });
            dispatch(setProcess(false));
        } catch (error) {
            console.error("Error deleting program:", error);
            handleError(error);
            dispatch(setProcess(false));
            setShowModalDelete({ isShow: false, id: '' });
        }
    };
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItemProgram((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update sort order locally
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    sort: index + 1
                }));

                // Call API to update sort order
                updateSortOrder(updatedItems);

                return updatedItems;
            });
        }
    };

    const updateSortOrder = async (items: ItemProgramDataProps[]) => {
        try {
            const sortData = items.map(item => ({
                id: item.id,
                sort: item.sort
            }));
            await axios.patch('/api/shop-management/by/program', { sortData });
        } catch (error) {
            console.error("Error updating sort order:", error);
            handleError(error);
        }
    };

    return (
        <main className="bg-white p-2 md:p-4">
            <Button variant="secondary" onClick={handleBack} className="mb-3 w-full md:w-auto">
                <i className="fa-solid fa-arrow-left pr-2"></i>
                {lang['button_back']}
            </Button>
            {
                item && (
                    <div className="px-2">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 mb-2">
                            <p className="font-bold text-sm md:text-base">{lang['page_shop_management_shop']} :</p>
                            <p className="text-sm md:text-base md:col-span-3">{item.shopInfo.shopName}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 mb-2">
                            <p className="font-bold text-sm md:text-base">{lang['page_machine_info_machine_type']} :</p>
                            <p className="text-sm md:text-base md:col-span-3">{item.machineInfo.machineType}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 mb-2">
                            <p className="font-bold text-sm md:text-base">{lang['page_machine_info_model']} :</p>
                            <p className="text-sm md:text-base md:col-span-3">{item.machineInfo.machineModel}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 mb-2">
                            <p className="font-bold text-sm md:text-base">{lang['page_shop_management_machine_name']} :</p>
                            <p className="text-sm md:text-base md:col-span-3">{item.shopManagementName}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 mb-2">
                            <p className="font-bold text-sm md:text-base">{lang['page_shop_management_machine_id']} :</p>
                            <p className="text-sm md:text-base md:col-span-3">{item.shopManagementMachineID}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 mb-2">
                            <p className="font-bold text-sm md:text-base">{lang['page_shop_management_iot_id']} :</p>
                            <p className="text-sm md:text-base md:col-span-3">{item.shopManagementIotID}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-2 mb-4">
                            <p className="font-bold text-sm md:text-base">{lang['page_shop_management_interval_time']} :</p>
                            <p className="text-sm md:text-base md:col-span-3">{item.shopManagementIntervalTime} {lang['page_shop_management_second']} {lang['global_minutes']}</p>
                        </div>
                        <Tabs
                            className="mb-3"
                            defaultActiveKey="program"
                        >

                            <Tab
                                eventKey="program"
                                title={lang['page_shop_management_program']}
                            >
                                <div className="table-responsive-wrapper">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th className="text-sm md:text-base">{lang['page_program_info_program_code']}</th>
                                                    <th className="text-sm md:text-base">{lang['page_program_info_description']}</th>
                                                    <th className="text-sm md:text-base">{lang['page_shop_management_price']}</th>
                                                    <th className="text-sm md:text-base">{lang['page_shop_management_operation_time_mins']}</th>
                                                    <th className="text-sm md:text-base">{lang['global_action']}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <SortableContext
                                                    items={itemProgram}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    {
                                                        itemProgram && itemProgram.length > 0 ? (
                                                            itemProgram.map((item) => (
                                                                <SortableRow key={item.id} id={item.id}>
                                                                    <td className="text-xs md:text-sm">{item.programInfo.programName}</td>
                                                                    <td className="text-xs md:text-sm">{item.programInfo.programDescription}</td>
                                                                    <td className="text-xs md:text-sm text-right">{item.machineProgramPrice}</td>
                                                                    <td className="text-xs md:text-sm text-center">{item.machineProgramOperationTime}</td>
                                                                    <td>
                                                                        <div className="flex justify-center">
                                                                            <Button variant="danger" size="sm" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}>
                                                                                <i className="fa-solid fa-trash"></i>
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </SortableRow>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={5} className="text-center text-xs md:text-sm">No data available</td>
                                                            </tr>
                                                        )
                                                    }
                                                </SortableContext>
                                            </tbody>
                                        </Table>
                                    </DndContext>
                                </div>
                            </Tab>
                        </Tabs>
                        <Button variant="primary" onClick={() => handleOpenAddProgram()} className="w-full md:w-auto mt-4">
                            <i className="fa-solid fa-plus pr-2"></i>{lang['page_shop_management_manage_program']}
                        </Button>
                        <ShopManagementProgramModal
                            show={showModal}
                            handleClose={handleCloseModal}
                            handleSave={handleSaveProgram}
                            lang={lang}
                            item={item}
                            defaultItemProgram={defaultItemProgram}
                        />
                        <ModalActionDelete
                            show={showModalDelete.isShow}
                            handleClose={() => setShowModalDelete({ isShow: false, id: '' })}
                            title={lang['page_shop_management_deleting_program_price']}
                            text={lang['global_delete_confirmation']}
                            id={showModalDelete.id}
                            handleConfirm={(id) => handleDeleteProgram(id)}
                        />
                    </div>
                )
            }


        </main>
    )
}

export default ShopManagementProgramPage