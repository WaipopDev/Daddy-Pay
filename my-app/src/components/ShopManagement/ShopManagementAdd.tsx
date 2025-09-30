'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {  Col, Form } from 'react-bootstrap';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import axios from 'axios';
import { openModalAlert } from '@/store/features/modalSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useErrorHandler } from '@/store/useErrorHandler';
import validateRequiredFields from '@/utils/validateRequiredFields';
import _ from 'lodash';

interface MachineDataProps {
    id: string;
    machineKey: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
}

interface ShopManagementAddProps {
    show: boolean;
    handleClose: () => void;
    onSuccess: () => void;
}

const ShopManagementAdd: React.FC<ShopManagementAddProps> = ({
    show,
    handleClose,
    onSuccess,
}) => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const { handleError } = useErrorHandler();
    const formRef = useRef<HTMLFormElement>(null);
    const [validated, setValidated] = useState(false);
    const [activeMachineType, setActiveMachineType] = useState('');
    const [itemShop, setItemShop] = useState<{id:string, shopName:string}[] | []>([]);
    const [itemMachine, setItemMachine] = useState<MachineDataProps[][] | null>(null);

    const fetchShopListData = useCallback(async () => {
        try {
            const response = await axios.get('/api/shop-info/list');
            if (response.status === 200) {
                
                setItemShop(response.data);
                // const groupByType = _.groupBy(response.data, 'machineType');
                // const orderedByType = _.orderBy(groupByType, ['machineType'], ['asc']);
                // setItemMachine(orderedByType);
            }
        } catch (error) {
            console.error("Error fetching shop list:", error);
        }
    }, []);

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

    useEffect(() => {
        fetchShopListData();
        fetchMachineListData();
    }, [fetchShopListData, fetchMachineListData]);

    const handleSaveShopManagement = async () => {
        const form = formRef.current;
        if (!form) return;

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        try {
            const shopId              = form['shopId'].value;
            const machineType         = form['machineType'].value;
            const machineModel        = form['machineModel'].value;
            const machineName         = form['machineName'].value;
            const machineID           = form['machineID'].value;
            const machineIotId        = form['machineIotId'].value;
            const machineIntervalTime = form['machineIntervalTime'].value;

            const message = validateRequiredFields([
                { value: shopId, label: lang['page_shop_management_shop'] },
                { value: machineType, label: lang['page_machine_info_machine_type'] },
                { value: machineModel, label: lang['page_machine_info_model'] },
                { value: machineName, label: lang['page_shop_management_machine_name'] },
                { value: machineID, label: lang['page_shop_management_machine_id'] },
                { value: machineIotId, label: lang['page_shop_management_iot_id'] },
                { value: machineIntervalTime, label: lang['page_shop_management_interval_time'] }
            ]);
            if (message) {
                dispatch(openModalAlert({ message: `${lang['global_required_fields']}<br/>${message}` }));
                return;
            }
            const param = {
                shopId,
                machineType: itemMachine ? itemMachine[Number(machineType)][0].machineType : '',
                machineModel,
                machineName,
                machineID,
                machineIotId,
                machineIntervalTime
            }

            await axios.post('/api/shop-management', param);

            setValidated(false);
            handleClose();
            form.reset();
            setActiveMachineType('');

            onSuccess();

            dispatch(openModalAlert({
                message: lang['global_add_success_message']
            }));
        } catch (error) {
            console.error('Error saving machine data:', error);
            handleError(error);
        }
    }

    const handleCloseModal = () => {
        handleClose();
        setValidated(false);
        setActiveMachineType('');
        if (formRef.current) {
            formRef.current.reset();
        }
    }

    return (
        <ModalForm
            show={show}
            handleClose={handleCloseModal}
            title={lang['page_shop_management_adding']}
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
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_machine_id']}
                        placeholder={lang['page_shop_management_machine_id']}
                        name="machineID"
                        required
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_iot_id']}
                        placeholder={lang['page_shop_management_iot_id']}
                        name="machineIotId"
                        required
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_interval_time']}
                        placeholder={lang['page_shop_management_interval_time']}
                        name="machineIntervalTime"
                        required
                    />
                </Col>
            </Form>
        </ModalForm>
    );
};

export default ShopManagementAdd;
