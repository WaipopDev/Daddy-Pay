'use client';

import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { useAppSelector } from '@/store/hook';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import DatePickerForm from '@/components/FormGroup/DatePickerForm';
import {
    getOnlinePaymentStatusOptions,
    isOnlinePaymentStatus,
} from '@/constants/shopInfo';
import type { ShopOnlinePaymentFormData } from '@/types/shopInfoType';
import { validateOnlinePaymentForm } from '@/utils/shopInfoOnlinePaymentValidation';

interface ModalActionOnlinePaymentProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    shopId: string;
    initialData?: ShopOnlinePaymentFormData;
    onSave: (shopId: string, data: ShopOnlinePaymentFormData) => Promise<void>;
    isSaving?: boolean;
}

const EMPTY_FORM: ShopOnlinePaymentFormData = {
    onlinePaymentStatus: '',
    onlineActivationDate: '',
    onlineCloseDate: '',
};

const parseDateValue = (value?: string): Date | null => {
    if (!value) return null;
    const parsed = moment(value, ['YYYY-MM-DD', moment.ISO_8601], true);
    return parsed.isValid() ? parsed.toDate() : null;
};

const ModalActionOnlinePayment: React.FC<ModalActionOnlinePaymentProps> = ({
    show,
    handleClose,
    title,
    shopId,
    initialData,
    onSave,
    isSaving = false,
}) => {
    const lang = useAppSelector((state) => state.lang) as Record<string, string>;
    const [formData, setFormData] = useState<ShopOnlinePaymentFormData>(EMPTY_FORM);
    const [activationDate, setActivationDate] = useState<Date | null>(null);
    const [closeDate, setCloseDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const statusOptions = getOnlinePaymentStatusOptions(lang).map((item) => ({
        label: item.label,
        value: item.value,
    }));

    useEffect(() => {
        if (!show) return;

        if (initialData) {
            setFormData({
                onlinePaymentStatus: initialData.onlinePaymentStatus || '',
                onlineActivationDate: initialData.onlineActivationDate || '',
                onlineCloseDate: initialData.onlineCloseDate || '',
            });
            setActivationDate(parseDateValue(initialData.onlineActivationDate));
            setCloseDate(parseDateValue(initialData.onlineCloseDate));
        } else {
            setFormData(EMPTY_FORM);
            setActivationDate(null);
            setCloseDate(null);
        }
        setErrors({});
    }, [show, initialData]);

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            onlinePaymentStatus: isOnlinePaymentStatus(value) ? value : '',
        }));
        if (errors.onlinePaymentStatus) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.onlinePaymentStatus;
                return next;
            });
        }
    };

    const handleActivationDateChange = (date: Date | null) => {
        setActivationDate(date);
        setFormData((prev) => ({
            ...prev,
            onlineActivationDate: date ? moment(date).format('YYYY-MM-DD') : '',
        }));
        if (errors.onlineActivationDate) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.onlineActivationDate;
                return next;
            });
        }
    };

    const handleCloseDateChange = (date: Date | null) => {
        setCloseDate(date);
        setFormData((prev) => ({
            ...prev,
            onlineCloseDate: date ? moment(date).format('YYYY-MM-DD') : '',
        }));
        if (errors.onlineCloseDate) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.onlineCloseDate;
                return next;
            });
        }
    };

    const handleCloseModal = () => {
        setFormData(EMPTY_FORM);
        setActivationDate(null);
        setCloseDate(null);
        setErrors({});
        handleClose();
    };

    const handleSave = async () => {
        const validationErrors = validateOnlinePaymentForm(formData, lang);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await onSave(shopId, formData);
    };

    const formKey = `${shopId}-${show}-${formData.onlinePaymentStatus}`;

    return (
        <Modal show={show} centered onHide={handleCloseModal}>
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Col className="mb-2">
                        <DropdownForm
                            key={`status-${formKey}`}
                            label={lang['page_shop_info_online_payment_status']}
                            name="onlinePaymentStatus"
                            required
                            defaultValue={formData.onlinePaymentStatus}
                            items={statusOptions}
                            onChange={handleStatusChange}
                            placeholder={lang['global_select']}
                            disabled={isSaving}
                            isInvalid={!!errors.onlinePaymentStatus}
                            errorMessage={errors.onlinePaymentStatus}
                        />
                    </Col>

                    <Col className="mb-2">
                        <DatePickerForm
                            label={lang['page_shop_info_online_activation_date']}
                            value={activationDate}
                            onChange={handleActivationDateChange}
                            required
                            disabled={isSaving}
                            isInvalid={!!errors.onlineActivationDate}
                            errorMessage={errors.onlineActivationDate}
                        />
                    </Col>

                    <Col className="mb-2">
                        <DatePickerForm
                            label={lang['page_shop_info_online_close_date']}
                            value={closeDate}
                            onChange={handleCloseDateChange}
                            required
                            disabled={isSaving}
                            isInvalid={!!errors.onlineCloseDate}
                            errorMessage={errors.onlineCloseDate}
                        />
                    </Col>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                    <i className="fa-solid fa-floppy-disk pr-2"></i>
                    {lang['button_save']}
                </Button>
                <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
                    <i className="fa-solid fa-xmark pr-2"></i>
                    {lang['button_cancel']}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalActionOnlinePayment;
