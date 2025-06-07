'use client';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Button, Col, Form, Tab, Table, Tabs } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { openModalAlert, setProcess } from "@/store/features/modalSlice";
import { useErrorHandler } from "@/store/useErrorHandler";
import ModalForm from "@/components/Modals/ModalForm";
import InputForm from "@/components/FormGroup/inputForm";
import DropdownForm from "@/components/FormGroup/dropdownForm";
import validateRequiredFields from "@/utils/validateRequiredFields";
import ModalActionDelete from "@/components/Modals/ModalActionDelete";

interface ItemDataProps {
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

interface defaultItemProgramDataProps {
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
    programInfo:{
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
    const formRef = useRef<HTMLFormElement>(null);

    const [validated, setValidated] = useState(false);
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
    }, [dispatch,handleError]);

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
            fetchItemData(item.machineInfo.id,item.shopInfo.id);
        }
    }, [item, fetchProgramData, fetchItemData]);
    const handleBack = () => {
        router.push('/shop-management');
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveProgram = async () => {
        const form = formRef.current;
        if (!form) return;

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }
         if (!item) {
            dispatch(openModalAlert({
                message: lang['global_error_message']
            }));
            return;
        }
        const machineProgramID     = form['machineProgramID'].value;
        const programPrice         = form['programPrice'].value;
        const programOperationTime = form['programOperationTime'].value;

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
                shopInfoId   : item.shopInfo.id,
                machineInfoId: item.machineInfo.id,
            }

            await axios.post('/api/shop-management/by/program', params);

            setValidated(false);
            setShowModal(false);
            form.reset();

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

    const handleOpenAddProgram = () =>{
        if(defaultItemProgram.length === 0) {
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
    return (
        <main className="bg-white p-2">
            <Button variant="secondary" onClick={handleBack} className="mb-3">
                <i className="fa-solid fa-arrow-left pr-2"></i>
                {lang['button_back']}
            </Button>
            {
                item && (
                    <div className="px-2">
                        <div className="flex pb-2">
                            <p className="w-1/4 font-bold">{lang['page_shop_management_shop']} :</p>
                            <p>{item.shopInfo.shopName}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="w-1/4 font-bold">{lang['page_machine_info_machine_type']} :</p>
                            <p>{item.machineInfo.machineType}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="w-1/4 font-bold">{lang['page_machine_info_model']} :</p>
                            <p>{item.machineInfo.machineModel}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="w-1/4 font-bold">{lang['page_shop_management_machine_name']} :</p>
                            <p>{item.shopManagementName}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="w-1/4 font-bold">{lang['page_shop_management_machine_id']} :</p>
                            <p>{item.shopManagementMachineID}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="w-1/4 font-bold">{lang['page_shop_management_iot_id']} :</p>
                            <p>{item.shopManagementIotID}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="w-1/4 font-bold">{lang['page_shop_management_interval_time']} :</p>
                            <p>{item.shopManagementIntervalTime} {lang['page_shop_management_second']} {lang['global_minutes']}</p>
                        </div>
                        <Tabs
                            className="mb-3"
                            defaultActiveKey="program"
                        >

                            <Tab
                                eventKey="program"
                                title={lang['page_shop_management_program']}
                            >
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>{lang['page_program_info_program_code']}</th>
                                            <th>{lang['page_program_info_description']}</th>
                                            <th>{lang['page_shop_management_price']}</th>
                                            <th>{lang['page_shop_management_operation_time_mins']}</th>
                                            <th>{lang['global_action']}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            itemProgram && itemProgram.length > 0 ? (
                                               itemProgram.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.programInfo.programName}</td>
                                                        <td>{item.programInfo.programDescription}</td>
                                                        <td>{item.machineProgramPrice}</td>
                                                        <td>{item.machineProgramOperationTime}</td>
                                                        <td>
                                                            <Button variant="danger" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}>
                                                                <i className="fa-solid fa-trash"></i>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}>No data available</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </Tab>
                        </Tabs>
                        <Button variant="primary" onClick={() => handleOpenAddProgram()}><i className="fa-solid fa-plus pr-2"></i>{lang['page_shop_management_manage_program']}</Button>
                        <ModalForm
                            show={showModal}
                            handleClose={() => handleCloseModal()}
                            title={lang['page_shop_management_adding_program_price']}
                            handleSave={() => handleSaveProgram()}
                        >
                            <Form noValidate validated={validated} ref={formRef} >
                                <div className="flex pb-2">
                                    <p className="basis-1/3 font-bold">{lang['page_shop_management_shop']}<span className="text-red-500">*</span> :</p>
                                    <p>{item.shopInfo.shopName}</p>
                                </div>
                                <div className="flex pb-2">
                                    <p className="basis-1/3 font-bold">{lang['page_machine_info_machine_type']}<span className="text-red-500">*</span> :</p>
                                    <p>{item.machineInfo.machineType}</p>
                                </div>
                                <div className="flex pb-2">
                                    <p className="basis-1/3 font-bold">{lang['page_machine_info_model']}<span className="text-red-500">*</span> :</p>
                                    <p>{item.machineInfo.machineModel}</p>
                                </div>
                                <Col className="mb-2">
                                    <DropdownForm
                                        label={lang['page_shop_management_program']}
                                        name="machineProgramID"
                                        required
                                        items={defaultItemProgram ? defaultItemProgram.map(program => ({
                                            label: program.programName,
                                            value: program.id
                                        })) : []}
                                    />
                                </Col>
                                <Col className="mb-2">
                                    <InputForm
                                        label={lang['global_price']}
                                        placeholder={lang['global_price']}
                                        name="programPrice"
                                        type="number"
                                        required
                                    />
                                </Col>
                                <Col className="mb-2">
                                    <InputForm
                                        label={lang['page_shop_management_operation_time']}
                                        placeholder={lang['page_shop_management_operation_time']}
                                        name="programOperationTime"
                                        type="number"
                                        required
                                    />
                                </Col>
                            </Form>
                        </ModalForm>
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