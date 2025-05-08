'use client';
import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { closeModalAlert } from '@/store/features/modalSlice';

const TextModalAlert: { [key: string]: string } = {
    "DUPLICATE_USER": 'ผู้ใช้งานนี้มีอยู่ในระบบแล้ว',
    "USER_NOT_FOUND": 'ไม่พบผู้ใช้งาน',
    "NOT_UPDATE_YOURSELF": 'ไม่สามารถอัปเดตข้อมูลของตัวเองได้',
    "NOT_DELETE_YOURSELF": 'ไม่สามารถลบตัวเองได้',
    "CLIENT_NOT_FOUND": 'ไม่พบบัญชีผู้ใ่ช้ API',
    "DUPLICATE_CLIENT": 'บัญชีผู้ใ่ช้ API นี้มีอยู่ในระบบแล้ว',
    "CSV_FILE_ONLY": 'รองรับเฉพาะไฟล์ CSV เท่านั้น',
    "FILE_IS_REQUIRED": 'ต้องระบุไฟล์',
    "FILE_SIZE_LIMIT_700MB": 'ขนาดไฟล์ต้องไม่เกิน 700MB',
    "BATCH_NOT_FOUND": 'ไม่พบข้อมูล Batch ไฟล์นี้',
    "MULTI_CHECK_FILE_NOT_FOUND": 'ไม่พบไฟล์',
    "MULTI_CHECK_FILE_NOT_SUCCESS": 'ตรวจสอบไฟล์ไม่สำเร็จ',
    "MULTI_CHECK_FILE_EXPIRED": 'ไฟล์หมดอายุ',
    "MULTI_CHECK_FILE_STATUS_NOT_FAIL": 'สถานะไฟล์ล้มเหลว',
    "CLIENT_IP_NOT_MATCH": 'IP ของผู้ใช้งานไม่ตรงกับที่ลงทะเบียนไว้',
}
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
                    <p>{TextModalAlert[`${message}`] ? TextModalAlert[`${message}`] : message}</p>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalAlert