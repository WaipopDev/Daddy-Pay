'use client';
import React, { useState, useRef } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { openModalAlert, setProcess } from '@/store/features/modalSlice';
import InputForm from '@/components/FormGroup/inputForm';
import ButtonSubmit from '@/components/Button/ButtonSubmit';
import ButtonCancel from '@/components/Button/ButtonCancel';

const ChangePasswordPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const formRef = useRef<HTMLFormElement>(null);
    
    const [validated, setValidated] = useState(false);
    const [isProcess, setIsProcess] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = lang['validation_password_required'] || 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = lang['validation_password_required'] || 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = lang['validation_password_min_length'] || 'Password must be at least 6 characters';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = lang['page_change_password_same_password'] || 'New password must be different from current password';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = lang['page_change_password_confirm_required'] || 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = lang['page_change_password_password_mismatch'] || 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        if (!validateForm()) {
            setValidated(true);
            return;
        }

        setIsProcess(true);
        dispatch(setProcess(true));

        try {
            const response = await axios.post('/api/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (response.status === 200) {
                dispatch(openModalAlert({
                    message: lang['page_change_password_success'] || 'Password changed successfully',
                    title: lang['global_success'] || 'Success'
                }));
                
                // Reset form
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setValidated(false);
                setErrors({});
                
                // Optionally redirect after a delay
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            }
        } catch (error) {
            const err = error as AxiosError;
            const errorMessage = (err.response?.data as { message?: string })?.message || err.message || 'Failed to change password';
            dispatch(openModalAlert({
                message: errorMessage,
                title: lang['global_error'] || 'Error'
            }));
        } finally {
            setIsProcess(false);
            dispatch(setProcess(false));
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <main className="bg-white p-2 md:p-4">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">
                            {lang['menu_change_password'] || 'Change Password'}
                        </h2>
                        
                        <Form 
                            ref={formRef}
                            noValidate 
                            validated={validated} 
                            onSubmit={handleSubmit}
                        >
                            <Row>
                                <Col md={12} className="mb-3">
                                    <InputForm
                                        label={lang['page_change_password_current'] || 'Current Password'}
                                        placeholder={lang['page_change_password_current_placeholder'] || 'Enter current password'}
                                        name="currentPassword"
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                        required
                                        isInvalid={!!errors.currentPassword}
                                        errorMessage={errors.currentPassword}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} className="mb-3">
                                    <InputForm
                                        label={lang['page_change_password_new'] || 'New Password'}
                                        placeholder={lang['page_change_password_new_placeholder'] || 'Enter new password'}
                                        name="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        required
                                        isInvalid={!!errors.newPassword}
                                        errorMessage={errors.newPassword}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} className="mb-3">
                                    <InputForm
                                        label={lang['page_change_password_confirm'] || 'Confirm New Password'}
                                        placeholder={lang['page_change_password_confirm_placeholder'] || 'Confirm new password'}
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        required
                                        isInvalid={!!errors.confirmPassword}
                                        errorMessage={errors.confirmPassword}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} className="flex gap-2 justify-end mt-4">
                                    <ButtonCancel handleCancel={handleCancel} />
                                    <ButtonSubmit 
                                        isProcess={isProcess} 
                                        title={lang['button_save'] || 'Save'} 
                                        className="w-auto"
                                        icon="fa-solid fa-floppy-disk"
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default ChangePasswordPage;

