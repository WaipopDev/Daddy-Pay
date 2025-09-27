import React, { useState, useEffect } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import InputForm from '@/components/FormGroup/inputForm';
import DropdownForm from '@/components/FormGroup/dropdownForm';
// import { validateUserForm } from '@/utils/userValidation';
import { USER_ROLES } from '@/constants/user';
// import { useShopData } from '@/hooks/useShopData';
import { UserDataItemDataProps } from '@/types/userType';
import { useShopInfoList } from '@/hooks/useUserData';

interface UserFormProps {
    formRef: React.RefObject<HTMLFormElement>;
    validated: boolean;
    lang: { [key: string]: string };
    onFormChange?: (isValid: boolean) => void;
    errors: Partial<UserFormData>;
    editData?: UserDataItemDataProps;
    isEditMode?: boolean;
}

interface UserFormData {
    username: string;
    email: string;
    password: string;
    role: string;
    shopIds: string[];
}

const UserForm: React.FC<UserFormProps> = ({
    formRef,
    validated,
    lang,
    // onFormChange,
    errors,
    editData,
    isEditMode = false
}) => {
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        password: '',
        role: USER_ROLES.USER,
        shopIds: []
    });
    // const [errors, setErrors] = useState<Partial<UserFormData>>({});

    // const { items: shops } = useShopData();
    const { itemShop:shops } = useShopInfoList();

    const roleOptions = [
        { value: USER_ROLES.USER, label: lang['page_user_role_user'] || 'User' },
        { value: USER_ROLES.ADMIN, label: lang['page_user_role_admin'] || 'Admin' }
    ];

    // Effect to populate form data when in edit mode
    useEffect(() => {
        if (isEditMode && editData) {
            setFormData({
                username: editData.username || '',
                email: editData.email || '',
                password: '', // Don't pre-fill password for security
                role: editData.role || USER_ROLES.USER,
                shopIds: editData.permissions.map(permission => permission.shopId) || []
            });
        }
    }, [isEditMode, editData]);

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleShopChange = (shopId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            shopIds: checked 
                ? [...prev.shopIds, shopId]
                : prev.shopIds.filter(id => id !== shopId)
        }));
    };

    return (
        <Form noValidate validated={validated} ref={formRef}>
            <Row>
                <Col md={12} className="mb-3">
                    <InputForm
                        label={lang['page_user_username'] || 'Username'}
                        placeholder={lang['page_user_username_placeholder'] || 'Enter username'}
                        name="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        required
                        isInvalid={!!errors.username}
                        errorMessage={errors.username}
                    />
                </Col>
            </Row>
            <Col className="mb-3">
                <InputForm
                    label={lang['page_user_email'] || 'Email'}
                    placeholder={lang['page_user_email_placeholder'] || 'Enter email'}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                />
            </Col>

            { !isEditMode && (
                <Col className="mb-3">
                    <InputForm
                        label={lang['page_user_password'] || 'Password'}
                        placeholder={isEditMode ? (lang['page_user_password_edit_placeholder'] || 'Leave blank to keep current password') : (lang['page_user_password_placeholder'] || 'Enter password')}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required={!isEditMode}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                    />
                </Col>
            )}
            <Col className="mb-3">
                <DropdownForm
                    label={lang['page_user_role'] || 'Role'}
                    name="role"
                    items={roleOptions}
                    value={formData.role}
                    defaultValue={isEditMode ? editData?.role || USER_ROLES.USER : USER_ROLES.USER}
                    onChange={(e) => handleInputChange('role', e)}
                    required
                    isInvalid={!!errors.role}
                    errorMessage={errors.role}
                />
            </Col>

            <Row>
                <Col md={12} className="mb-3">
                    <Form.Group>
                        <Form.Label className="font-bold m-0">
                            {lang['page_user_manage_branch']} <span className="text-red-500">*</span> :
                        </Form.Label>
                        <div className="mt-2">
                            {shops && shops.length > 0 ? (
                                shops.map((shop, index) => (
                                    <Form.Check
                                        key={shop.id}
                                        type="checkbox"
                                        id={`shop-${shop.id}`}
                                        name="shopIds"
                                        value={shop.id}
                                        label={`${index + 1}.) ${shop.shopName}`}
                                        checked={ formData.shopIds.includes(shop.id)}
                                        onChange={(e) => handleShopChange(shop.id, e.target.checked)}
                                        className="mb-2"
                                    />
                                ))
                            ) : (
                                <div className="text-muted">
                                    {lang['global_no_data'] || 'No shops available'}
                                </div>
                            )}
                        </div>
                        {errors.shopIds && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                                {errors.shopIds}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

UserForm.displayName = 'UserForm';

export default UserForm;
