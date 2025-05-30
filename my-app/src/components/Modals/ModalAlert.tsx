'use client';
import React from 'react'
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { closeModalAlert } from '@/store/features/modalSlice';
import { useRouter } from 'next/navigation';


const ModalAlert = () => {
     const router = useRouter();
    const modalAlert = useAppSelector((state) => state.modal.alert);
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const dispatch = useAppDispatch();
    const { show, message, callbackPath  } = modalAlert;

    const handleClose = () => {
        dispatch(closeModalAlert());
        if(callbackPath){
            router.push(callbackPath);
        }
    }

    return (
        <>
            <Modal show={show} centered onHide={() => handleClose()}>
                <Modal.Header className="py-2" closeButton>
                    <Modal.Title>{lang['global_alert']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default ModalAlert
