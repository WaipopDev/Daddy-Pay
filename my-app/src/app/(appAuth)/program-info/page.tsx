'use client';
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook';

import { useErrorHandler } from '@/store/useErrorHandler';
import axios from 'axios';
import { openModalAlert } from '@/store/features/modalSlice';
import { Button, Col } from 'react-bootstrap';
import TableComponent from '@/components/Table/Table';
import _ from 'lodash';
import ModalActionDelete from '@/components/Modals/ModalActionDelete';
import ProgramModal, { ProgramFormData } from '@/components/ProgramInfo/ProgramModal';

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
    const { handleError } = useErrorHandler();

    const [page, setPage] = useState({ page: 1, totalPages: 1 });
    const [item, setItem] = useState<ItemDataProps[] | null>(null);
    const [itemMachine, setItemMachine] = useState<MachineDataProps[][] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState({ isShow: false, id: '' });
    const [editData, setEditData] = useState<ItemDataProps | null>(null);


    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            const response = await axios.get(`/api/program-info?page=${pageNumber}&search=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
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

    const handleSaveProgram = async (data: ProgramFormData) => {
        try {
            const params = {
                ...data
            }

            if (editData) {
                await axios.patch(`/api/program-info`, { ...params, id: editData.id });
                dispatch(openModalAlert({
                    message: lang['global_update_success_message'] || 'Update Success'
                }));
            } else {
                await axios.post('/api/program-info', params);
                dispatch(openModalAlert({
                    message: lang['global_add_success_message']
                }));
            }

            setShowModal(false);
            setEditData(null);
            fetchData(1);

        } catch (error) {
            console.error('Error saving program data:', error);
            handleError(error);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setEditData(null);
    }

    const handleDeleteProgram = async (id: string) => {
        try {
            const response = await axios.delete(`/api/program-info?programId=${id}`);
            if (response.status === 200) {
                setShowModalDelete({ isShow: false, id: '' });
                fetchData(1); // Refresh the data after deletion
            }
        } catch (error) {
            console.error("Error deleting program:", error);
        }
    };
    return (
        <main className="bg-white p-2 md:p-4">
            <div className="flex border-b border-gray-300 pb-2 mb-4">
                <Col className="flex justify-start">

                </Col>
                <Col className="flex justify-end">
                    <Button variant="primary" onClick={() => handleOpenMachine()} className="w-full md:w-auto">
                        <i className="fa-solid fa-plus pr-2"></i>{lang['button_add_program']}
                    </Button>
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
                                <td className="text-center">{(page.page - 1) * 10 + index + 1}</td>
                                <td className="text-xs md:text-sm">{item.programName}</td>
                                <td className="text-xs md:text-sm">{item.programDescription}</td>
                                <td className="text-xs md:text-sm">{item.machineInfo?.machineType}</td>
                                <td className="text-xs md:text-sm">{item.machineInfo?.machineBrand}</td>

                                <td>
                                    <div className="flex gap-1 justify-center">
                                        <Button variant="warning" size="sm" onClick={() => {
                                            setEditData(item);
                                            setShowModal(true);
                                        }}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => setShowModalDelete({ isShow: true, id: item.id })}>
                                            <i className="fa-solid fa-trash"></i>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center text-xs md:text-sm">{lang['global_no_data']}</td>
                            </tr>
                        ))
                    }
                </TableComponent>
            </Suspense>
            <ProgramModal
                show={showModal}
                handleClose={() => handleCloseModal()}
                handleSave={(data) => handleSaveProgram(data)}
                itemMachine={itemMachine}
                lang={lang}
                editData={editData}
            />
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