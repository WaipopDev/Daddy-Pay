'use client';
import { useAppSelector } from '@/store/hook';
import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ModalForm = ({
    show,
    handleClose,
    title,
    handleSave,
    children
}: {
    show: boolean;
    handleClose: () => void;
    title: string;
    handleSave: () => void;
    children: React.ReactNode;
}) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    return (
        <Modal show={show} centered onHide={() => handleClose()}>
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => handleSave()}><i className="fa-solid fa-floppy-disk pr-2"></i>{lang['button_save']}</Button>
                <Button variant="secondary" onClick={() => handleClose()}><i className="fa-solid fa-xmark pr-2"></i>{lang['button_cancel']}</Button>
            </Modal.Footer>

        </Modal>
    )
}

export default ModalForm
