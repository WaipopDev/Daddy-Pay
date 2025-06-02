'use client';
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import TableComponent from '@/components/Table/Table'
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import UploadFileForm from '@/components/FormGroup/uploadFileForm';
import axios from 'axios';
import { openModalAlert } from '@/store/features/modalSlice';
import { useErrorHandler } from '@/store/useErrorHandler';
import Image from 'next/image';
import PageNoData from '@/components/PageNoData'

interface ItemDataProps {
    id: number;
    machineKey: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
    machineDescription: string;
    machinePicturePath: string;
    createdAt: string;
    updatedAt: string;
}

const MachineInfoPage = () => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { handleError } = useErrorHandler();

    const [page, setPage] = useState({ page: 1, totalPages: 1 });
    const [item, setItem] = useState<ItemDataProps[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);


    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            const response = await axios.get(`/api/machine-info?page=${pageNumber}&search=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                console.log("🚀 ~ fetchData ~ response:", response.data);
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

    const handleSaveMachine = async () => {
        const form = formRef.current;
        if (!form) return;

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        try {

            const formData = new FormData(form);

            await axios.post('/api/machine-info', formData);

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

    return (
        <main className="bg-white p-2">
            <div className="flex border-b border-gray-300 pb-2">
                <Col className="flex justify-start">

                </Col>
                <Col className="flex justify-end">
                    <Button variant="primary" onClick={() => handleOpenMachine()}><i className="fa-solid fa-plus pr-2"></i>{lang['button_add_machine']}</Button>
                </Col>
            </div>
            <Suspense fallback={<p>Loading feed...</p>}>
                <TableComponent
                    head={[
                        '#',
                        lang['page_machine_info_machine_type'],
                        lang['page_machine_info_brand'],
                        lang['page_machine_info_model'],
                        lang['page_machine_info_description'],
                        lang['page_machine_info_picture'],
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
                                <td>{item.machineType}</td>
                                <td>{item.machineBrand}</td>
                                <td>{item.machineModel}</td>
                                <td>{item.machineDescription}</td>
                                <td className="flex justify-center"><Image src={item.machinePicturePath} alt={item.machineType} width={40} height={40} /></td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => router.push(`/machine-info/edit/${item.id}`)}><i className="fa-solid fa-pen-to-square"></i></Button>
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => console.log(`Delete machine with ID: ${item.id}`)}><i className="fa-solid fa-trash"></i></Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center">{lang['global_no_data']}</td>
                            </tr>
                        ))
                    }
                </TableComponent>
            </Suspense>
            <ModalForm
                show={showModal}
                handleClose={() => handleCloseModal()}
                title={lang['page_machine_info_add_machine']}
                handleSave={() => handleSaveMachine()}
            >
                <Form noValidate validated={validated} ref={formRef} >
                    <Col className="mb-2">
                        <InputForm
                            label={lang['page_machine_info_machine_type']}
                            placeholder={lang['page_machine_info_machine_type']}
                            name="machineType"
                            required
                        />
                    </Col>
                    <Col className="mb-2">
                        <InputForm
                            label={lang['page_machine_info_brand']}
                            placeholder={lang['page_machine_info_brand']}
                            name="machineBrand"
                            required
                        />
                    </Col>
                    <Col className="mb-2">
                        <InputForm
                            label={lang['page_machine_info_model']}
                            placeholder={lang['page_machine_info_model']}
                            name="machineModel"
                            required
                        />
                    </Col>
                    <Col className="mb-2">
                        <InputForm
                            label={lang['page_machine_info_description']}
                            placeholder={lang['page_machine_info_description']}
                            name="machineDescription"

                        />
                    </Col>
                    <Col className="mb-2">
                        <UploadFileForm
                            label={lang['page_machine_info_picture']}
                            placeholder={lang['page_machine_info_picture']}
                            name="machinePicture"

                        />
                    </Col>
                </Form>
            </ModalForm>
        </main>
    )
}
                               
export default MachineInfoPage