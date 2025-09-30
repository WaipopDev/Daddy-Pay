'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Col, Form } from 'react-bootstrap';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import axios from 'axios';
// import { openModalAlert } from '@/store/features/modalSlice';
import {  useAppSelector } from '@/store/hook';
import { useErrorHandler } from '@/store/useErrorHandler';
// import validateRequiredFields from '@/utils/validateRequiredFields';
import _ from 'lodash';

interface MachineDataProps {
    id: string;
    machineKey: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
}

interface ShopManagementDataProps {
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
    };
    shopInfo: {
        id: string;
        shopName: string;
    };
}

interface ShopManagementEditProps {
    show: boolean;
    handleClose: () => void;
    // onSuccess: () => void;
    editId: string;
}

const ShopManagementEdit: React.FC<ShopManagementEditProps> = ({
    show,
    handleClose,
    // onSuccess,
    editId
}) => {
    // const dispatch = useAppDispatch();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const { handleError } = useErrorHandler();
    const formRef = useRef<HTMLFormElement>(null);
    const [validated, setValidated] = useState(false);
    const [activeMachineType, setActiveMachineType] = useState('');
    const [editData, setEditData] = useState<ShopManagementDataProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [itemShop, setItemShop] = useState<{id:string, shopName:string}[] | []>([]);
    const [itemMachine, setItemMachine] = useState<MachineDataProps[][] | null>(null);

    const fetchMachineListData = useCallback(async () => {
        try {
            const response = await axios.get('/api/machine-info/list');
            if (response.status === 200) {
                const groupByType = _.groupBy(response.data, 'machineType');
                const orderedByType = _.orderBy(groupByType, ['machineType'], ['asc']);
                setItemMachine(orderedByType);
            }
        } catch (error) {
            console.error("Error fetching machine list:", error);
        }
    }, []);

    const fetchShopListData = useCallback(async () => {
        try {
            const response = await axios.get('/api/shop-info/list-user');
            if (response.status === 200) {
                
                setItemShop(response.data);
            }
        } catch (error) {
            console.error("Error fetching shop list:", error);
        }
    }, []);

    useEffect(() => {
        fetchShopListData();
        fetchMachineListData();
    }, [fetchShopListData, fetchMachineListData]);
    // Fetch edit data when component mounts or editId changes
    useEffect(() => {
        if (show && editId) {
            fetchEditData();
        }
    }, [show, editId]);

    const fetchEditData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/shop-management/by/${editId}`);
            if (response.status === 200) {
                setEditData(response.data);
                // Set the active machine type based on the edit data
                const machineTypeIndex = itemMachine?.findIndex(machineGroup => 
                    machineGroup[0].machineType === response.data.machineInfo.machineType
                );
                if (machineTypeIndex !== undefined && machineTypeIndex !== -1) {
                    setActiveMachineType(machineTypeIndex.toString());
                }
            }
        } catch (error) {
            console.error('Error fetching edit data:', error);
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveShopManagement = async () => {
        const form = formRef.current;
        if (!form) return;
return
        // setValidated(true);

        // if (form.checkValidity() === false) {
        //     return;
        // }

        // try {
        //     const shopId              = form['shopId'].value;
        //     const machineType         = form['machineType'].value;
        //     const machineModel        = form['machineModel'].value;
        //     const machineName         = form['machineName'].value;
        //     const machineID           = form['machineID'].value;
        //     const machineIotId        = form['machineIotId'].value;
        //     const machineIntervalTime = form['machineIntervalTime'].value;

        //     const message = validateRequiredFields([
        //         { value: shopId, label: lang['page_shop_management_shop'] },
        //         { value: machineType, label: lang['page_machine_info_machine_type'] },
        //         { value: machineModel, label: lang['page_machine_info_model'] },
        //         { value: machineName, label: lang['page_shop_management_machine_name'] },
        //         { value: machineID, label: lang['page_shop_management_machine_id'] },
        //         { value: machineIotId, label: lang['page_shop_management_iot_id'] },
        //         { value: machineIntervalTime, label: lang['page_shop_management_interval_time'] }
        //     ]);
        //     if (message) {
        //         dispatch(openModalAlert({ message: `${lang['global_required_fields']}<br/>${message}` }));
        //         return;
        //     }
        //     const param = {
        //         shopId,
        //         machineType: itemMachine ? itemMachine[Number(machineType)][0].machineType : '',
        //         machineModel,
        //         machineName,
        //         machineID,
        //         machineIotId,
        //         machineIntervalTime
        //     }

        //     await axios.patch(`/api/shop-management/by/${editId}`, param);

        //     setValidated(false);
        //     handleClose();
        //     form.reset();
        //     setActiveMachineType('');
        //     setEditData(null);

        //     onSuccess();

        //     dispatch(openModalAlert({
        //         message: lang['global_edit_success_message']
        //     }));
        // } catch (error) {
        //     console.error('Error updating machine data:', error);
        //     handleError(error);
        // }
    }

    const handleCloseModal = () => {
        handleClose();
        setValidated(false);
        setActiveMachineType('');
        setEditData(null);
        if (formRef.current) {
            formRef.current.reset();
        }
    }

    // Set form values when edit data is loaded
    // useEffect(() => {
    //     if (editData && formRef.current) {
    //         const form = formRef.current;
    //         form['shopId'].value = editData.shopInfo.id;
    //         form['machineName'].value = editData.shopManagementName;
    //         form['machineID'].value = editData.shopManagementMachineID;
    //         form['machineIotId'].value = editData.shopManagementIotID;
    //         form['machineIntervalTime'].value = editData.shopManagementIntervalTime.toString();
    //     }
    // }, [editData]);

    if (isLoading) {
        return (
            <ModalForm
                show={show}
                handleClose={handleCloseModal}
                title={lang['page_shop_management_editing']}
                handleSave={() => {}}
            >
                <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading data...</p>
                </div>
            </ModalForm>
        );
    }

    return (
        <ModalForm
            show={show}
            handleClose={handleCloseModal}
            title={lang['page_shop_management_editing']}
            handleSave={handleSaveShopManagement}
        >
            <Form noValidate validated={validated} ref={formRef}>
                <Col className="mb-2">
                    <DropdownForm
                        label={lang['page_shop_management_shop']}
                        name="shopId"
                        required
                        items={itemShop ? _.map(itemShop, (shop) => ({
                            label: shop.shopName,
                            value: shop.id
                        })) : []}
                        defaultValue={editData?.shopInfo.id}
                    />
                </Col>
                <Col className="mb-2">
                    <DropdownForm
                        label={lang['page_machine_info_machine_type']}
                        name="machineType"
                        required
                        items={itemMachine ? _.map(itemMachine, (machine, index) => ({
                            label: machine[0].machineType,
                            value: index.toString()
                        })) : []}
                        onChange={(value) => setActiveMachineType(value)}
                    />
                </Col>
                <Col className="mb-2">
                    <DropdownForm
                        label={lang['page_machine_info_model']}
                        name="machineModel"
                        required
                        items={itemMachine && activeMachineType ? itemMachine[Number(activeMachineType)].map(machine => ({
                            label: machine.machineModel,
                            value: machine.id.toString()
                        })) : []}
                        disabled={!activeMachineType}
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_machine_name']}
                        placeholder={lang['page_shop_management_machine_name']}
                        name="machineName"
                        required
                        defaultValue={editData?.shopManagementName}
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_machine_id']}
                        placeholder={lang['page_shop_management_machine_id']}
                        name="machineID"
                        required
                        defaultValue={editData?.shopManagementMachineID}
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_iot_id']}
                        placeholder={lang['page_shop_management_iot_id']}
                        name="machineIotId"
                        required
                        defaultValue={editData?.shopManagementIotID}
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_interval_time']}
                        placeholder={lang['page_shop_management_interval_time']}
                        name="machineIntervalTime"
                        required
                        defaultValue={editData?.shopManagementIntervalTime.toString()}
                    />
                </Col>
            </Form>
        </ModalForm>
    );
};

export default ShopManagementEdit;
