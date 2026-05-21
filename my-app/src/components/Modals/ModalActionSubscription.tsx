'use client';

import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { useAppSelector } from '@/store/hook';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import DatePickerForm from '@/components/FormGroup/DatePickerForm';
import EmailTagsForm from '@/components/FormGroup/EmailTagsForm';
import {
    getSubscriptionNotificationCycleOptions,
    getSubscriptionStatusOptions,
    isSubscriptionStatus,
} from '@/constants/shopInfo';
import type { ShopSubscriptionFormData } from '@/types/shopInfoType';
import { validateSubscriptionForm } from '@/utils/shopInfoSubscriptionValidation';

interface ModalActionSubscriptionProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    shopId: string;
    initialData?: ShopSubscriptionFormData;
    onSave: (shopId: string, data: ShopSubscriptionFormData) => Promise<void>;
    isSaving?: boolean;
}

const EMPTY_FORM: ShopSubscriptionFormData = {
    subSubscriptionStatus: '',
    subRegistrationDate: '',
    subExpirationDate: '',
    subNotificationCycle: '',
    subNotifyToEmail: '',
};

const parseDateValue = (value?: string): Date | null => {
    if (!value) return null;
    const parsed = moment(value, ['YYYY-MM-DD', moment.ISO_8601], true);
    return parsed.isValid() ? parsed.toDate() : null;
};

const ModalActionSubscription: React.FC<ModalActionSubscriptionProps> = ({
    show,
    handleClose,
    title,
    shopId,
    initialData,
    onSave,
    isSaving = false,
}) => {
    const lang = useAppSelector((state) => state.lang) as Record<string, string>;
    const [formData, setFormData] = useState<ShopSubscriptionFormData>(EMPTY_FORM);
    const [registrationDate, setRegistrationDate] = useState<Date | null>(null);
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const statusOptions = getSubscriptionStatusOptions(lang).map((item) => ({
        label: item.label,
        value: item.value,
    }));

    const cycleOptions = getSubscriptionNotificationCycleOptions(lang).map((item) => ({
        label: item.label,
        value: item.value,
    }));

    useEffect(() => {
        if (!show) return;

        if (initialData) {
            setFormData({
                subSubscriptionStatus: initialData.subSubscriptionStatus || '',
                subRegistrationDate: initialData.subRegistrationDate || '',
                subExpirationDate: initialData.subExpirationDate || '',
                subNotificationCycle: initialData.subNotificationCycle || '',
                subNotifyToEmail: initialData.subNotifyToEmail || '',
            });
            setRegistrationDate(parseDateValue(initialData.subRegistrationDate));
            setExpirationDate(parseDateValue(initialData.subExpirationDate));
        } else {
            setFormData(EMPTY_FORM);
            setRegistrationDate(null);
            setExpirationDate(null);
        }
        setErrors({});
    }, [show, initialData]);

    const clearError = (field: keyof ShopSubscriptionFormData) => {
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            subSubscriptionStatus: isSubscriptionStatus(value) ? value : '',
        }));
        clearError('subSubscriptionStatus');
    };

    const handleRegistrationDateChange = (date: Date | null) => {
        setRegistrationDate(date);
        setFormData((prev) => ({
            ...prev,
            subRegistrationDate: date ? moment(date).format('YYYY-MM-DD') : '',
        }));
        clearError('subRegistrationDate');
    };

    const handleExpirationDateChange = (date: Date | null) => {
        setExpirationDate(date);
        setFormData((prev) => ({
            ...prev,
            subExpirationDate: date ? moment(date).format('YYYY-MM-DD') : '',
        }));
        clearError('subExpirationDate');
    };

    const handleCycleChange = (value: string) => {
        const cycle = Number(value);
        setFormData((prev) => ({
            ...prev,
            subNotificationCycle: Number.isInteger(cycle) ? cycle : '',
        }));
        clearError('subNotificationCycle');
    };

    const handleEmailTagsChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            subNotifyToEmail: value,
        }));
        clearError('subNotifyToEmail');
    };

    const handleCloseModal = () => {
        setFormData(EMPTY_FORM);
        setRegistrationDate(null);
        setExpirationDate(null);
        setErrors({});
        handleClose();
    };

    const handleSave = async () => {
        const validationErrors = validateSubscriptionForm(formData, lang);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await onSave(shopId, formData);
    };

    const formKey = `${shopId}-${show}-${formData.subSubscriptionStatus}-${formData.subNotificationCycle}`;

    return (
        <Modal show={show} centered onHide={handleCloseModal} size="lg">
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Col className="mb-2">
                        <DropdownForm
                            key={`sub-status-${formKey}`}
                            label={lang['page_shop_info_subscription_status']}
                            name="subSubscriptionStatus"
                            required
                            defaultValue={formData.subSubscriptionStatus}
                            items={statusOptions}
                            onChange={handleStatusChange}
                            placeholder={lang['global_select']}
                            disabled={isSaving}
                            isInvalid={!!errors.subSubscriptionStatus}
                            errorMessage={errors.subSubscriptionStatus}
                        />
                    </Col>

                    <Col className="mb-2">
                        <DatePickerForm
                            label={lang['page_shop_info_registration_date']}
                            value={registrationDate}
                            onChange={handleRegistrationDateChange}
                            required
                            disabled={isSaving}
                            isInvalid={!!errors.subRegistrationDate}
                            errorMessage={errors.subRegistrationDate}
                        />
                    </Col>

                    <Col className="mb-2">
                        <DatePickerForm
                            label={lang['page_shop_info_expiration_date']}
                            value={expirationDate}
                            onChange={handleExpirationDateChange}
                            required
                            disabled={isSaving}
                            isInvalid={!!errors.subExpirationDate}
                            errorMessage={errors.subExpirationDate}
                        />
                    </Col>

                    <Col className="mb-2">
                        <DropdownForm
                            key={`sub-cycle-${formKey}`}
                            label={lang['page_shop_info_notification_cycle']}
                            name="subNotificationCycle"
                            required
                            defaultValue={
                                formData.subNotificationCycle
                                    ? String(formData.subNotificationCycle)
                                    : ''
                            }
                            items={cycleOptions}
                            onChange={handleCycleChange}
                            placeholder={lang['global_select']}
                            disabled={isSaving}
                            isInvalid={!!errors.subNotificationCycle}
                            errorMessage={errors.subNotificationCycle}
                        />
                    </Col>

                    <Col className="mb-2">
                        <EmailTagsForm
                            label={lang['page_shop_info_notify_to_email']}
                            required
                            value={formData.subNotifyToEmail}
                            onChange={handleEmailTagsChange}
                            onInvalidInput={(message) =>
                                setErrors((prev) => ({
                                    ...prev,
                                    subNotifyToEmail: message,
                                }))
                            }
                            placeholder={lang['page_shop_info_notify_to_email_placeholder']}
                            addHint={lang['page_shop_info_notify_to_email_hint']}
                            invalidEmailMessage={
                                lang['validation_subscription_notify_email_invalid']
                            }
                            disabled={isSaving}
                            isInvalid={!!errors.subNotifyToEmail}
                            errorMessage={errors.subNotifyToEmail}
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

export default ModalActionSubscription;
