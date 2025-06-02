'use client';
import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import { useAppDispatch, useAppSelector } from '@/store/hook';
// import { closeModalAlert } from '@/store/features/modalSlice';
import ButtonCancel from '../Button/ButtonCancel';
import { useAppSelector } from '@/store/hook';

interface ModalActionDeleteProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    text?: string;
    id: string;
    handleConfirm: (id: string) => void;
}
const ModalActionDelete = ({
    show,
    handleClose,
    title,
    text,
    id,
    handleConfirm,
}: ModalActionDeleteProps) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    return (
        <Modal show={show} centered onHide={() => handleClose()}>
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{text}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleConfirm(id)}>
                    <i className="fa-solid fa-trash-can pr-2"></i>{lang['button_delete']}
                </Button>
                <Button variant="secondary" onClick={() => handleClose()}><i className="fa-solid fa-xmark pr-2"></i>{lang['button_cancel']}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalActionDelete