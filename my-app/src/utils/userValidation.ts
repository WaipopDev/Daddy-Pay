import { USER_ROLES } from '@/constants/user';

export interface UserFormData {
    username  : string;
    email     : string;
    password ?: string;
    role      : string;
    shopIds   : string[];
    createdBy?: string;
    updatedBy?: string;
}

export interface ValidationErrors {
    [key: string]: string | undefined;
}

/**
 * Validates user form data
 */
export const validateUserForm = (
    formData: UserFormData, 
    lang: { [key: string]: string },
    isEditMode: boolean = false
): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Username validation
    if (!formData.username.trim()) {
        errors.username = lang['validation_username_required'] || 'Username is required';
    } else if (formData.username.length < 3) {
        errors.username = lang['validation_username_min_length'] || 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
        errors.username = lang['validation_username_max_length'] || 'Username must not exceed 50 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = lang['validation_username_format'] || 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
        errors.email = lang['validation_email_required'] || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = lang['validation_email_format'] || 'Please enter a valid email address';
    } else if (formData.email.length > 100) {
        errors.email = lang['validation_email_max_length'] || 'Email must not exceed 100 characters';
    }

    // Password validation (only required for add mode, optional for edit mode)
    if (!isEditMode) {
        if (!formData.password?.trim()) {
            errors.password = lang['validation_password_required'] || 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = lang['validation_password_min_length'] || 'Password must be at least 6 characters';
        } else if (formData.password.length > 100) {
            errors.password = lang['validation_password_max_length'] || 'Password must not exceed 100 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = lang['validation_password_strength'] || 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
    } else {
        // For edit mode, only validate password if it's provided
        if (formData.password?.trim()) {
            if (formData.password.length < 6) {
                errors.password = lang['validation_password_min_length'] || 'Password must be at least 6 characters';
            } else if (formData.password.length > 100) {
                errors.password = lang['validation_password_max_length'] || 'Password must not exceed 100 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                errors.password = lang['validation_password_strength'] || 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
            }
        }
    }

    // Role validation
    if (!formData.role) {
        errors.role = lang['validation_role_required'] || 'Role is required';
    } else if (!Object.values(USER_ROLES).includes(formData.role as (typeof USER_ROLES)[keyof typeof USER_ROLES])) {
        errors.role = lang['validation_role_invalid'] || 'Please select a valid role';
    }

    // Shop validation
    if (!formData.shopIds || formData.shopIds.length === 0) {
        errors.shopIds = lang['validation_shop_required'] || 'At least one shop must be selected';
    }

    return errors;
};

/**
 * Validates individual field
 */
export const validateField = (
    name: keyof UserFormData,
    value: string | string[],
    lang: { [key: string]: string },
    isEditMode: boolean = false
): string | undefined => {
    const formData: UserFormData = {
        username: '',
        email: '',
        password: '',
        role: '',
        shopIds: [],
        [name]: value
    };

    const errors = validateUserForm(formData, lang, isEditMode);
    return errors[name];
};

/**
 * Checks if form is valid
 */
export const isFormValid = (formData: UserFormData, lang: { [key: string]: string }, isEditMode: boolean = false): boolean => {
    const errors = validateUserForm(formData, lang, isEditMode);
    return Object.keys(errors).length === 0;
};
