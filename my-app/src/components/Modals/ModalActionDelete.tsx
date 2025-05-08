'use client';
import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { closeModalAlert } from '@/store/features/modalSlice';
import ButtonCancel from '../Button/ButtonCancel';

interface ModalActionDeleteProps {
    show: boolean;
    handleClose: () => void;
    name: string;
    id: number;
    handleConfirm: (id: number) => void;
}
const ModalActionDelete = ({
    show,
    handleClose,
    name,
    id,
    handleConfirm,
}: ModalActionDeleteProps) => {
    return (
        <Modal show={show} centered onHide={() => handleClose()}>
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>ยืนยันการลบข้อมูล</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>คุณต้องการลบข้อมูล {name}</p>
            </Modal.Body>
            <Modal.Footer>
                <ButtonCancel handleCancel={handleClose} />
                <Button variant="danger" onClick={() => handleConfirm(id)}>
                    <i className="fa-solid fa-trash-can"></i> ลบข้อมูล
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalActionDelete