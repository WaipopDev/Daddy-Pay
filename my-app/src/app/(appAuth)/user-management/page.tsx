'use client';
import React, { Suspense, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import TableComponent from "@/components/Table/Table";
import ModalActionDelete from "@/components/Modals/ModalActionDelete";
import ModalActionUserSubscribe from "@/components/Modals/ModalActionUserSubscribe";
import ModalForm from "@/components/Modals/ModalForm";
import { openModalAlert } from "@/store/features/modalSlice";

// Custom hooks
import { useUserData } from "@/hooks/useUserData";
import { useUserOperations } from "@/hooks/useUserOperations";

// Components
import { UserInfoHeader, UserInfoFilter, UserInfoTableContent } from "@/components/UserInfo";
import type { UserInfoSearchParams } from "@/types/userType";
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
        handleAddUser,
        handleEditUser,
        handleDeleteUser,
        handleShowDeleteModal,
        handleCloseDeleteModal,
        handleCloseAddModal,
        handleCloseEditModal,
        handleSaveUser,
        handleUpdateUser,
        showModalSubscribe,
        isSavingSubscribe,
        handleShowSubscribeModal,
        handleCloseSubscribeModal,
        handleSaveSubscribe,
    } = useUserOperations({
        lang,
        onDeleteSuccess: async () => {
            await fetchData(page.page);
        },
        onAddSuccess: async () => {
            await fetchData(page.page);
            dispatch(openModalAlert({
                message: lang['page_user_add_success']
            }));
        },
        onEditSuccess: async () => {
            await fetchData(page.page);
            dispatch(openModalAlert({
                message: lang['page_user_edit_success']
            }));
        },
        onSubscribeSaveSuccess: async () => {
            await fetchData(page.page);
        },
    });

    const handleFilterSearch = (search: UserInfoSearchParams) => {
        fetchData(1, search);
    };

    const handlePageChange = (pageNumber: number) => {
        fetchData(pageNumber);
    };

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
        <main className="bg-white p-2 md:p-4" role="main">
            <ErrorBoundary>
                <UserInfoHeader
                    onAddUser={handleAddUser}
                    lang={lang}
                    isLoading={isLoading}
                />

                <UserInfoFilter
                    lang={lang}
                    isLoading={isLoading}
                    onSearch={handleFilterSearch}
                />

                <Suspense fallback={<p>Loading feed...</p>}>
                    <TableComponent
                        head={tableHeaders}
                        page={page.page}
                        totalPages={page.totalPages}
                        handleActive={handlePageChange}
                    >
                        <UserInfoTableContent
                            items={items}
                            currentPage={page.page}
                            lang={lang}
                            onEdit={handleEditUser}
                            onDelete={handleShowDeleteModal}
                            onSubscribe={handleShowSubscribeModal}
                            isLoading={isLoading}
                        />
                    </TableComponent>
                </Suspense>

                <ModalForm
                    show={showModalAdd}
                    handleClose={handleCloseModal}
                    title={lang['page_user_add_user']}
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
                    title={lang['page_user_edit_user']}
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

                <ModalActionUserSubscribe
                    show={showModalSubscribe.isShow}
                    handleClose={handleCloseSubscribeModal}
                    title={`${lang['page_user_edit_subscription']} - ${showModalSubscribe.username}`}
                    userId={showModalSubscribe.userId}
                    initialData={showModalSubscribe.initialData}
                    onSave={handleSaveSubscribe}
                    isSaving={isSavingSubscribe}
                />

                <ModalActionDelete
                    show={showModalDelete.isShow}
                    handleClose={handleCloseDeleteModal}
                    title={lang['page_user_deleting']}
                    text={lang['global_delete_confirmation']}
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