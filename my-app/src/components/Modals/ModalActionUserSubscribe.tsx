'use client';

import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { useAppSelector } from '@/store/hook';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import DatePickerForm from '@/components/FormGroup/DatePickerForm';
import { getUserSubscribeStatusOptions } from '@/constants/user';
import type { UserSubscribeFormData } from '@/types/userType';
import { validateUserSubscribeForm } from '@/utils/userSubscribeValidation';

interface ModalActionUserSubscribeProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    userId: string;
    initialData?: UserSubscribeFormData;
    onSave: (userId: string, data: UserSubscribeFormData) => Promise<void>;
    isSaving?: boolean;
}

const EMPTY_FORM: UserSubscribeFormData = {
    subscribe: false,
    subscribeStartDate: '',
    subscribeEndDate: '',
};

const parseDateValue = (value?: string | null): Date | null => {
    if (!value) return null;
    const parsed = moment(value, ['YYYY-MM-DD', moment.ISO_8601], true);
    return parsed.isValid() ? parsed.toDate() : null;
};

const ModalActionUserSubscribe: React.FC<ModalActionUserSubscribeProps> = ({
    show,
    handleClose,
    title,
    userId,
    initialData,
    onSave,
    isSaving = false,
}) => {
    const lang = useAppSelector((state) => state.lang) as Record<string, string>;
    const [formData, setFormData] = useState<UserSubscribeFormData>(EMPTY_FORM);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const statusOptions = getUserSubscribeStatusOptions(lang).map((item) => ({
        label: item.label,
        value: item.value,
    }));

    const subscribeValue = formData.subscribe ? 'true' : 'false';

    useEffect(() => {
        if (!show) return;

        if (initialData) {
            setFormData({
                subscribe: initialData.subscribe,
                subscribeStartDate: initialData.subscribeStartDate || '',
                subscribeEndDate: initialData.subscribeEndDate || '',
            });
            setStartDate(parseDateValue(initialData.subscribeStartDate));
            setEndDate(parseDateValue(initialData.subscribeEndDate));
        } else {
            setFormData(EMPTY_FORM);
            setStartDate(null);
            setEndDate(null);
        }
        setErrors({});
    }, [show, initialData]);

    const handleSubscribeChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            subscribe: value === 'true',
        }));
        if (errors.subscribe) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.subscribe;
                return next;
            });
        }
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        setFormData((prev) => ({
            ...prev,
            subscribeStartDate: date ? moment(date).format('YYYY-MM-DD') : '',
        }));
        if (errors.subscribeStartDate) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.subscribeStartDate;
                return next;
            });
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        setFormData((prev) => ({
            ...prev,
            subscribeEndDate: date ? moment(date).format('YYYY-MM-DD') : '',
        }));
        if (errors.subscribeEndDate) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.subscribeEndDate;
                return next;
            });
        }
    };

    const handleCloseModal = () => {
        setFormData(EMPTY_FORM);
        setStartDate(null);
        setEndDate(null);
        setErrors({});
        handleClose();
    };

    const handleSave = async () => {
        const validationErrors = validateUserSubscribeForm(formData, lang);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await onSave(userId, formData);
    };

    const formKey = `${userId}-${show}-${subscribeValue}`;

    return (
        <Modal show={show} centered onHide={handleCloseModal}>
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Col className="mb-2">
                        <DropdownForm
                            key={`subscribe-${formKey}`}
                            label={lang['page_user_subscription']}
                            name="subscribe"
                            required
                            defaultValue={subscribeValue}
                            items={statusOptions}
                            onChange={handleSubscribeChange}
                            placeholder={lang['global_select']}
                            disabled={isSaving}
                            isInvalid={!!errors.subscribe}
                            errorMessage={errors.subscribe}
                        />
                    </Col>

                    <Col className="mb-2">
                        <DatePickerForm
                            label={lang['page_user_subscribe_start_date']}
                            value={startDate}
                            onChange={handleStartDateChange}
                            required={formData.subscribe}
                            disabled={isSaving}
                            isInvalid={!!errors.subscribeStartDate}
                            errorMessage={errors.subscribeStartDate}
                        />
                    </Col>

                    <Col className="mb-2">
                        <DatePickerForm
                            label={lang['page_user_subscribe_end_date']}
                            value={endDate}
                            onChange={handleEndDateChange}
                            required={formData.subscribe}
                            disabled={isSaving}
                            isInvalid={!!errors.subscribeEndDate}
                            errorMessage={errors.subscribeEndDate}
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

export default ModalActionUserSubscribe;
