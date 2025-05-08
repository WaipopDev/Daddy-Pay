'use client';
import React from 'react'
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { closeModalAlert } from '@/store/features/modalSlice';


const ModalAlert = () => {
    const modalAlert = useAppSelector((state) => state.modal.alert);
    const dispatch = useAppDispatch();
    const { show, message, title } = modalAlert;

    const handleClose = () => {
        dispatch(closeModalAlert());
    }
    return (
        <>
            <Modal show={show} centered onHide={() => handleClose()}>
                <Modal.Header className="py-2" closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalAlert