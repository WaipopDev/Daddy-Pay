'use client';
import React, { Suspense, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import TableComponent from "@/components/Table/Table";
import ModalActionDelete from "@/components/Modals/ModalActionDelete";
import ModalForm from "@/components/Modals/ModalForm";
import { openModalAlert } from "@/store/features/modalSlice";

// Custom hooks
import { useUserData } from "@/hooks/useUserData";
import { useUserOperations } from "@/hooks/useUserOperations";

// Components
import { UserInfoHeader, UserInfoTableContent } from "@/components/UserInfo";
import UserForm from "@/components/UserInfo/UserForm";

// Utils
import { getUserInfoTableHeaders } from "@/utils/userInfoUtils";
import { UserFormData, validateUserForm } from "@/utils/userValidation";
import ErrorBoundary from "@/components/ErrorBoundary";

const UserManagementPage = () => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const formRef = useRef<HTMLFormElement>(null);
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState<Partial<UserFormData>>({});
    // Custom hooks for data management and operations
    const { items, page, isLoading, fetchData } = useUserData();
    const {
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
    } = useUserOperations({
        onDeleteSuccess: async () => {
            await fetchData(page.page);
        },
        onAddSuccess: async () => {
            await fetchData(page.page);
            dispatch(openModalAlert({
                message: lang['global_add_success_message'] || 'User added successfully'
            }));
        },
        onEditSuccess: async () => {
            await fetchData(page.page);
            dispatch(openModalAlert({
                message: lang['global_edit_success_message'] || 'User updated successfully'
            }));
        }
    });
    console.log('isDeleting', isDeleting, isAdding, isEditing)

    // Get table headers
    const tableHeaders = getUserInfoTableHeaders(lang);

    const handleSaveUserForm = async () => {
        const form = formRef.current;
        if (!form) return;

        setValidated(true);
        if (form.checkValidity() === false) {
            return;
        }

        const userData = {
            username: form['username'].value,
            email   : form['email'].value,
            password: form['password'].value,
            role    : (form['role'] as unknown as HTMLSelectElement).value || '',
            shopIds: Array.from((form['shopIds'] as NodeListOf<HTMLInputElement>)).filter(input => input.checked).map(input => input.value)

        };
    
        // Check custom validation
        const validationErrors = validateUserForm(userData, lang);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await handleSaveUser(userData);
            handleCloseModal();
            fetchData(1);
        } catch (error) {
            // handleCloseAddModal();
            dispatch(openModalAlert({ 
                message: error as string, 
                title: "Alert Message" 
              }));
        }
    };

    const handleUpdateUserForm = async () => {
        const form = formRef.current;
        if (!form) return;
      
        setValidated(true);
        if (form.checkValidity() === false) {
            return;
        }

        const userData = {
            username: form['username'].value,
            email   : form['email'].value,
            role    : (form['role'] as unknown as HTMLSelectElement).value || '',
            shopIds: Array.from((form['shopIds'] as NodeListOf<HTMLInputElement>)).filter(input => input.checked).map(input => input.value)

        };
        // Check custom validation (password not required for edit)
        const validationErrors = validateUserForm(userData, lang, true);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await handleUpdateUser(userData);
            handleCloseEditModalForm();
            fetchData(1);
        } catch (error) {
            dispatch(openModalAlert({ 
                message: error as string, 
                title: "Alert Message" 
              }));
        }
    };

    const handleCloseModal = () => {
        handleCloseAddModal();
        setValidated(false);
        if (formRef.current) {
            formRef.current.reset();
            setErrors({});
            setValidated(false);
        }
    };

    const handleCloseEditModalForm = () => {
        handleCloseEditModal();
        setValidated(false);
        if (formRef.current) {
            formRef.current.reset();
            setErrors({});
            setValidated(false);
        }
    };

    return (
        <main className="bg-white p-2" role="main">
            <ErrorBoundary>
                <UserInfoHeader 
                    onAddUser={handleAddUser}
                    // onSearch={(searchTerm) => fetchData(1, searchTerm)}
                    lang={lang}
                    isLoading={isLoading}
                />

                <Suspense fallback={<p>Loading feed...</p>}>
                    <TableComponent
                        head={tableHeaders}
                        page={page.page}
                        totalPages={page.totalPages}
                        handleActive={(pageNumber: number) => fetchData(pageNumber)}
                    >
                        <UserInfoTableContent
                            items={items}
                            currentPage={page.page}
                            lang={lang}
                            onEdit={handleEditUser}
                            onDelete={handleShowDeleteModal}
                            isLoading={isLoading}
                        />
                    </TableComponent>
                </Suspense>

                <ModalForm
                    show={showModalAdd}
                    handleClose={handleCloseModal}
                    title={lang['page_user_add_user'] || 'Add User'}
                    handleSave={handleSaveUserForm}
                >
                    <UserForm
                        formRef={formRef as React.RefObject<HTMLFormElement>}
                        validated={validated}
                        lang={lang}
                        errors={errors}
                        isEditMode={false}
                    />
                </ModalForm>

                <ModalForm
                    show={showModalEdit.isShow}
                    handleClose={handleCloseEditModalForm}
                    title={lang['page_user_edit_user'] || 'Edit User'}
                    handleSave={handleUpdateUserForm}
                >
                    <UserForm
                        formRef={formRef as React.RefObject<HTMLFormElement>}
                        validated={validated}
                        lang={lang}
                        errors={errors}
                        editData={showModalEdit.data}
                        isEditMode={true}
                    />
                </ModalForm>

                <ModalActionDelete
                    show={showModalDelete.isShow}
                    handleClose={handleCloseDeleteModal}
                    title={lang['page_user_deleting'] || 'Deleting User'}
                    text={lang['global_delete_confirmation'] || 'Are you sure you want to delete this user?'}
                    id={showModalDelete.id}
                    handleConfirm={handleDeleteUser}
                />
            </ErrorBoundary>
        </main>
    );
};

// Set display name for debugging
UserManagementPage.displayName = 'UserManagementPage';

export default UserManagementPage;