'use client';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector } from '@/store/hook';

interface BankFormData {
    consumerId: string;
    consumerSecret: string;
    partnerId: string;
    merchantId: string;
    partnerSecret: string;
    bankActiveName: string;
    bankActiveId: string | null;
}

interface ModalActionBankProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    shopId: string;
    onSave: (shopId: string, bankData: BankFormData) => void;
    initialData?: BankFormData;
}

const ModalActionBank: React.FC<ModalActionBankProps> = ({
    show,
    handleClose,
    title,
    shopId,
    onSave,
    initialData
}) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    
    const [formData, setFormData] = useState<BankFormData>({
        consumerId: '',
        consumerSecret: '',
        partnerId: '',
        merchantId: '',
        partnerSecret: '',
        bankActiveName: '',
        bankActiveId: null
    });

    const [errors, setErrors] = useState<Partial<BankFormData>>({});

    // Initialize form data when modal opens or initialData changes
    useEffect(() => {
        if (show && initialData) {
            setFormData(initialData);
        } else if (show) {
            setFormData({
                consumerId: '',
                consumerSecret: '',
                partnerId: '',
                merchantId: '',
                partnerSecret: '',
                bankActiveName: '',
                bankActiveId: null
            });
        }
    }, [show, initialData]);

    const handleInputChange = (field: keyof BankFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<BankFormData> = {};
        
        if (!formData.consumerId.trim()) {
            newErrors.consumerId = 'Consumer ID is required';
        }
        if (!formData.consumerSecret.trim()) {
            newErrors.consumerSecret = 'Consumer Secret is required';
        }
        if (!formData.partnerId.trim()) {
            newErrors.partnerId = 'Partner ID is required';
        }
        if (!formData.merchantId.trim()) {
            newErrors.merchantId = 'Merchant ID is required';
        }
        if (!formData.partnerSecret.trim()) {
            newErrors.partnerSecret = 'Partner Secret is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(shopId, formData);
            handleClose();
        }
    };

    const handleCloseModal = () => {
        setFormData({
            consumerId: '',
            consumerSecret: '',
            partnerId: '',
            merchantId: '',
            partnerSecret: '',
            bankActiveName: '',
            bankActiveId: null
        });
        setErrors({});
        handleClose();
    };

    return (
        <Modal show={show} centered onHide={handleCloseModal} size="lg">
            <Modal.Header className="py-2" closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>{lang['form_consumer_id']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.consumerId}
                                    onChange={(e) => handleInputChange('consumerId', e.target.value)}
                                    isInvalid={!!errors.consumerId}
                                    placeholder="Enter Consumer ID"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.consumerId}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>{lang['form_consumer_secret']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.consumerSecret}
                                    onChange={(e) => handleInputChange('consumerSecret', e.target.value)}
                                    isInvalid={!!errors.consumerSecret}
                                    placeholder="Enter Consumer Secret"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.consumerSecret}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>{lang['form_partner_id']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.partnerId}
                                    onChange={(e) => handleInputChange('partnerId', e.target.value)}
                                    isInvalid={!!errors.partnerId}
                                    placeholder="Enter Partner ID"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.partnerId}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>{lang['form_merchant_id']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.merchantId}
                                    onChange={(e) => handleInputChange('merchantId', e.target.value)}
                                    isInvalid={!!errors.merchantId}
                                    placeholder="Enter Merchant ID"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.merchantId}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>{lang['form_partner_secret']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.partnerSecret}
                                    onChange={(e) => handleInputChange('partnerSecret', e.target.value)}
                                    isInvalid={!!errors.partnerSecret}
                                    placeholder="Enter Partner Secret"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.partnerSecret}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk pr-2"></i>
                    {lang['button_save_bank']}
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                    <i className="fa-solid fa-xmark pr-2"></i>
                    {lang['button_cancel']}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalActionBank;
