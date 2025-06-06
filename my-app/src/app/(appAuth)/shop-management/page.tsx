'use client';
import TableComponent from '@/components/Table/Table';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useErrorHandler } from '@/store/useErrorHandler';
import { useRouter } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import axios from 'axios';
import { openModalAlert } from '@/store/features/modalSlice';

import ModalActionDelete from '@/components/Modals/ModalActionDelete';
import _ from 'lodash';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import validateRequiredFields from '@/utils/validateRequiredFields';

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

interface MachineDataProps {
    id: string;
    machineKey: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
}

const ShopManagementPage = () => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { handleError } = useErrorHandler();

    const [page, setPage] = useState({ page: 1, totalPages: 1 });
    const [item, setItem] = useState<ItemDataProps[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState({ isShow: false, id: '' });
    const [itemMachine, setItemMachine] = useState<MachineDataProps[][] | null>(null);
    const [itemShop, setItemShop] = useState<{id:string, shopName:string}[] | []>([]);
    const [activeMachineType, setActiveMachineType] = useState('');
    const [activeShopType, setActiveShopType] = useState('');
    // console.log("🚀 ~ ShopManagementPage ~ activeMachineType:", itemShop)

    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            const response = await axios.get(`/api/shop-management?page=${pageNumber}&search=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                console.log('response.data', response.data.items)
                setItem(response.data.items);
                setPage({ page: response.data.meta.currentPage, totalPages: response.data.meta.totalPages });
            }
        } catch (error) {
            console.error("Error fetching shop info:", error);
        }
    }, []);

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
        fetchData();
        fetchShopListData();
        fetchMachineListData();
    }, [fetchData, fetchShopListData, fetchMachineListData]);

    const handleOpenMachine = () => {
        setShowModal(true);
    }

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
            setShowModal(false);
            form.reset();

            fetchData(page.page);

            dispatch(openModalAlert({
                message: lang['global_add_success_message']
            }));
        } catch (error) {
            console.error('Error saving machine data:', error);
            handleError(error);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setValidated(false);
        if (formRef.current) {
            formRef.current.reset();
        }
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
                                    <Button variant="warning" size="sm" onClick={() => router.push(`/machine-info/edit/${item.id}`)}><i className="fa-solid fa-pen-to-square"></i></Button>
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}><i className="fa-solid fa-trash"></i></Button>
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
            <ModalForm
                show={showModal}
                handleClose={() => handleCloseModal()}
                title={lang['page_shop_management_adding']}
                handleSave={() => handleSaveShopManagement()}
            >
                <Form noValidate validated={validated} ref={formRef} >
                    <Col className="mb-2">
                        <DropdownForm
                            label={lang['page_shop_management_shop']}
                            name="shopId"
                            required
                            items={itemShop ? _.map(itemShop, (shop, index) => ({
                                label: shop.shopName,
                                value: shop.id
                            })) : []}
                            onChange={(value) => setActiveShopType(value)}
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