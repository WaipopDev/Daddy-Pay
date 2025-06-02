'use client';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useRouter } from 'next/navigation';
import { useErrorHandler } from '@/store/useErrorHandler';
import axios from 'axios';
import { openModalAlert } from '@/store/features/modalSlice';
import { Button, Col, Form } from 'react-bootstrap';
import TableComponent from '@/components/Table/Table';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import _ from 'lodash';
import validateRequiredFields from '@/utils/validateRequiredFields';
import ModalActionDelete from '@/components/Modals/ModalActionDelete';

interface ItemDataProps {
    id: string;
    programKey: string;
    programName: string;
    programDescription: string;
    machineInfo: {
        id: string;
        machineKey: string;
        machineType: string;
        machineBrand: string;
        machineModel: string;
        machineDescription: string;
        machinePicturePath: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

interface MachineDataProps {
    id: string;
    machineKey: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
}

const ProgramInfoPage = () => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { handleError } = useErrorHandler();

    const [page, setPage] = useState({ page: 1, totalPages: 1 });
    const [item, setItem] = useState<ItemDataProps[] | null>(null);
    const [itemMachine, setItemMachine] = useState<MachineDataProps[][] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const [activeMachineType, setActiveMachineType] = useState('');
    const [showModalDelete, setShowModalDelete] = useState({ isShow: false, id: '' });


    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            const response = await axios.get(`/api/program-info?page=${pageNumber}&search=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                console.log('response.data', response.data)
                setItem(response.data.items);
                setPage({ page: response.data.meta.currentPage, totalPages: response.data.meta.totalPages });
            }
        } catch (error) {
            console.error("Error fetching program info:", error);
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
        fetchMachineListData();
    }, [fetchData, fetchMachineListData]);

    const handleOpenMachine = () => {
        setShowModal(true);
    }

    const handleSaveProgram = async () => {
        const form = formRef.current;
        if (!form) return;

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }
        const machineType = form['machineType'].value;
        const machineBrand = form['machineBrand'].value;
        const programName = form['programName'].value;
        const programDescription = form['programDescription'].value;
        const message = validateRequiredFields([
            { value: machineType, label: lang['page_machine_info_machine_type'] },
            { value: machineBrand, label: lang['page_machine_info_brand'] },
            { value: programName, label: lang['page_program_info_program_code'] },
        ]);
        if (message) {
            dispatch(openModalAlert({ message: `${lang['global_required_fields']}<br/>${message}` }));
            return;
        }
       
        try {
            const params = {
                machineType,
                machineBrand,
                programName,
                programDescription
            }

            await axios.post('/api/program-info', params);

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

    const handleDeleteProgram = async (id: string) => {
        try {
            const response = await axios.delete(`/api/program-info?programId=${id}`);
            if (response.status === 200) {
                setShowModalDelete({ isShow: false, id: '' });
                fetchData(page.page); // Refresh the data after deletion
            }
        } catch (error) {
            console.error("Error deleting program:", error);
        }
    };

    return (
        <main className="bg-white p-2">
            <div className="flex border-b border-gray-300 pb-2">
                <Col className="flex justify-start">

                </Col>
                <Col className="flex justify-end">
                    <Button variant="primary" onClick={() => handleOpenMachine()}><i className="fa-solid fa-plus pr-2"></i>{lang['button_add_program']}</Button>
                </Col>
            </div>
            <Suspense fallback={<p>Loading feed...</p>}>
                <TableComponent
                    head={[
                        '#',
                        lang['page_program_info_program_code'],
                        lang['page_program_info_description'],
                        lang['page_machine_info_machine_type'],
                        lang['page_machine_info_brand'],
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
                                <td>{item.programName}</td>
                                <td>{item.programDescription}</td>
                                <td>{item.machineInfo?.machineType}</td>
                                <td>{item.machineInfo?.machineBrand}</td>
                              
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => router.push(`/machine-info/edit/${item.id}`)}><i className="fa-solid fa-pen-to-square"></i></Button>
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}><i className="fa-solid fa-trash"></i></Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center">{lang['global_no_data']}</td>
                            </tr>
                        ))
                    }
                </TableComponent>
            </Suspense>
            <ModalForm
                show={showModal}
                handleClose={() => handleCloseModal()}
                title={lang['page_program_info_add_program']}
                handleSave={() => handleSaveProgram()}
            >
                <Form noValidate validated={validated} ref={formRef} >
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
                            label={lang['page_machine_info_brand']}
                            name="machineBrand"
                            required
                            items={itemMachine && activeMachineType ? itemMachine[Number(activeMachineType)].map(machine => ({
                                label: machine.machineBrand,
                                value: machine.id.toString()
                            })) : []}
                            disabled={!activeMachineType}
                        />
                    </Col>
                    <Col className="mb-2">
                        <InputForm
                            label={lang['page_program_info_program_code']}
                            placeholder={lang['page_program_info_program_code']}
                            name="programName"
                            required
                        />
                    </Col>
                    <Col className="mb-2">
                        <InputForm
                            label={lang['page_program_info_description']}
                            placeholder={lang['page_program_info_description']}
                            name="programDescription"
                        />
                    </Col>
                </Form>
            </ModalForm>
            <ModalActionDelete
                show={showModalDelete.isShow}
                handleClose={() => setShowModalDelete({ isShow: false, id: '' })}
                title={lang['page_program_info_deleting']}
                text={lang['global_delete_confirmation']}
                id={showModalDelete.id}
                handleConfirm={(id) => handleDeleteProgram(id)}
             />
        </main>
    )
}

export default ProgramInfoPage