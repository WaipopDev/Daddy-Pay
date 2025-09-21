import { useState, useCallback } from 'react';
import axios from 'axios';
import { UserModalDeleteState, UserModalEditState } from '@/types/userType';
import {  USER_API_ENDPOINTS } from '@/constants/user';
import { useAppSelector } from '@/store/hook';
import { UserFormData } from '@/utils/userValidation';


interface UseUserOperationsReturn {
    showModalDelete: UserModalDeleteState;
    showModalAdd: boolean;
    showModalEdit: UserModalEditState;
    isDeleting: boolean;
    isAdding: boolean;
    isEditing: boolean;
    handleAddUser: () => void;
    handleEditUser: (id: string) => void;
    handleDeleteUser: (id: string) => Promise<void>;
    handleShowDeleteModal: (id: string) => void;
    handleCloseDeleteModal: () => void;
    handleCloseAddModal: () => void;
    handleCloseEditModal: () => void;
    handleSaveUser: (formData: UserFormData) => Promise<void>;
    handleUpdateUser: (formData: UserFormData) => Promise<void>;
}

interface UseUserOperationsProps {
    onDeleteSuccess?: () => Promise<void>;
    onAddSuccess?: () => Promise<void>;
    onEditSuccess?: () => Promise<void>;
}

export const useUserOperations = ({ 
    onDeleteSuccess,
    onAddSuccess,
    onEditSuccess 
}: UseUserOperationsProps = {}): UseUserOperationsReturn => {
    const user = useAppSelector(state => state.user)
    const [showModalDelete, setShowModalDelete] = useState<UserModalDeleteState>({ 
        isShow: false, 
        id: '' 
    });
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState<UserModalEditState>({ 
        isShow: false, 
        id: '',
        data: undefined
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleAddUser = useCallback(() => {
        setShowModalAdd(true);
    }, []);

    const handleEditUser = useCallback(async (id: string) => {
        try {
            // Fetch user data for editing
            const response = await axios.get(USER_API_ENDPOINTS.GET_BY_ID(id));
            if (response.status === 200) {
                setShowModalEdit({ 
                    isShow: true, 
                    id: id,
                    data: response.data 
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            // TODO: Add proper error handling/notification
        }
    }, []);

    const handleDeleteUser = useCallback(async (id: string) => {
        try {
            setIsDeleting(true);
            const response = await axios.delete(USER_API_ENDPOINTS.DELETE(id));
            
            if (response.status === 200) {
                setShowModalDelete({ isShow: false, id: '' });
                if (onDeleteSuccess) {
                    await onDeleteSuccess();
                }
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            // TODO: Add proper error handling/notification
        } finally {
            setIsDeleting(false);
        }
    }, [onDeleteSuccess]);

    const handleShowDeleteModal = useCallback((id: string) => {
        setShowModalDelete({ isShow: true, id });
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setShowModalDelete({ isShow: false, id: '' });
    }, []);

    const handleCloseAddModal = useCallback(() => {
        setShowModalAdd(false);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setShowModalEdit({ isShow: false, id: '', data: undefined });
    }, []);

    const handleSaveUser = useCallback(async (formData: UserFormData) => {
        try {
            setIsAdding(true);
            formData.createdBy = user.id.toString();
            const response = await axios.post(USER_API_ENDPOINTS.BASE, formData);
            
            if (response.status === 200) {
                setShowModalAdd(false);
                if (onAddSuccess) {
                    await onAddSuccess();
                }
            }
        } catch (error) {
           throw error;
        } finally {
            setIsAdding(false);
        }
    }, [onAddSuccess, user.id]);

    const handleUpdateUser = useCallback(async (formData: UserFormData) => {
        try {
            setIsEditing(true);
            formData.updatedBy = user.id.toString();
            const response = await axios.patch(USER_API_ENDPOINTS.BASE, {
                ...formData,
                id: showModalEdit.id
            });
            
            if (response.status === 200) {
                setShowModalEdit({ isShow: false, id: '', data: undefined });
                if (onEditSuccess) {
                    await onEditSuccess();
                }
            }
        } catch (error) {
           throw error;
        } finally {
            setIsEditing(false);
        }
    }, [onEditSuccess, user.id, showModalEdit.id]);

    return {
        showModalDelete,
        showModalAdd,
        showModalEdit,
        isDeleting,
        isAdding,
        isEditing,
        handleAddUser,
        handleEditUser,
        handleDeleteUser,
        handleShowDeleteModal,
        handleCloseDeleteModal,
        handleCloseAddModal,
        handleCloseEditModal,
        handleSaveUser,
        handleUpdateUser,
    };
};
