'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { Button, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { openModalAlert, setProcess } from '@/store/features/modalSlice';
import { useErrorHandler } from '@/store/useErrorHandler';
import ShopInfoForm from '@/components/ShopInfoForm/ShopInfoForm';
import UserShopSelect from '@/components/UserShopManagement/UserShopSelect';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useMasterShopListNotAll } from '@/hooks';
import { SHOP_INFO_API_ENDPOINTS } from '@/constants/shopInfo';
import type { ItemShopInfoDataProps } from '@/types/shopInfoType';

const isNumericShopId = (shopId: string) => /^\d+$/.test(shopId);

const getShopDetailUrl = (shopId: string) =>
    isNumericShopId(shopId)
        ? SHOP_INFO_API_ENDPOINTS.GET_BY_ID_API(shopId)
        : SHOP_INFO_API_ENDPOINTS.GET_BY_ID(shopId);

const UserShopManagementPage = () => {
    const lang = useAppSelector((state) => state.lang) as Record<string, string>;
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();
    const { itemShop: shops, isLoading: isLoadingShops } = useMasterShopListNotAll();

    const [selectedShopId, setSelectedShopId] = useState('');
    const [item, setItem] = useState<ItemShopInfoDataProps | null>(null);
    const [isLoadingShop, setIsLoadingShop] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const activeShopId = useMemo(() => {
        if (!shops.length) return '';
        if (selectedShopId && shops.some((shop) => shop.id === selectedShopId)) {
            return selectedShopId;
        }
        return shops[0].id;
    }, [shops, selectedShopId]);

    useEffect(() => {
        if (shops.length > 0 && activeShopId && activeShopId !== selectedShopId) {
            setSelectedShopId(activeShopId);
        }
    }, [shops, activeShopId, selectedShopId]);

    const fetchShopInfo = useCallback(
        async (shopId: string) => {
            if (!shopId) {
                setItem(null);
                return;
            }

            try {
                setIsLoadingShop(true);
                const response = await axios.get(getShopDetailUrl(shopId));
                if (response.status === 200 && response.data) {
                    setItem(response.data);
                } else {
                    setItem(null);
                }
            } catch (error) {
                console.error('Error fetching shop info:', error);
                handleError(error);
                setItem(null);
            } finally {
                setIsLoadingShop(false);
            }
        },
        [handleError]
    );

    useEffect(() => {
        if (activeShopId) {
            fetchShopInfo(activeShopId);
        }
    }, [activeShopId, fetchShopInfo]);

    const handleShopChange = (shopId: string) => {
        setSelectedShopId(shopId);
        setIsEditing(false);
        setValidated(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isEditing) {
            return;
        }

        const form = event.currentTarget;
        setValidated(true);

        if (!form.checkValidity() || !item?.id) {
            return;
        }

        try {
            dispatch(setProcess(true));
            const formData = new FormData(form);
            const patchShopId = encodeURIComponent(item.id);
            await axios.patch(
                `${SHOP_INFO_API_ENDPOINTS.BASE}?shopId=${patchShopId}`,
                formData
            );

            dispatch(
                openModalAlert({
                    message: lang['global_edit_success_message'],
                })
            );
            await fetchShopInfo(activeShopId);
            setIsEditing(false);
            setValidated(false);
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setProcess(false));
        }
    };

    const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        // Defer so Save (same position) does not receive the tail of this click.
        window.setTimeout(() => {
            setIsEditing(true);
            setValidated(false);
        }, 0);
    };

    const handleSaveClick = () => {
        if (!isEditing) return;
        formRef.current?.requestSubmit();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setValidated(false);
        if (activeShopId) {
            fetchShopInfo(activeShopId);
        }
    };

    if (isLoadingShops) {
        return <LoadingSpinner message={lang['global_loading_data']} />;
    }

    return (
        <main className="bg-white p-2 md:p-4" role="main">
            {shops.length === 0 ? (
                <p className="text-center text-sm md:text-base text-gray-500 py-8">
                    {lang['global_no_data']}
                </p>
            ) : (
                <>
                    <UserShopSelect
                        lang={lang}
                        shops={shops}
                        value={activeShopId}
                        onChange={handleShopChange}
                        disabled={isLoadingShop}
                    />

                    {activeShopId && (
                        isLoadingShop ? (
                            <LoadingSpinner message={lang['global_loading_data']} />
                        ) : item ? (
                            <>
                                <div className="flex flex-col md:flex-row pb-2 mb-4 gap-2">
                                    <Col className="flex justify-end gap-2">
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    disabled={isLoadingShop}
                                                    className="w-full md:w-auto"
                                                >
                                                    <i
                                                        className="fa-solid fa-xmark pr-2"
                                                        aria-hidden="true"
                                                    ></i>
                                                    {lang['button_cancel']}
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    type="button"
                                                    onClick={handleSaveClick}
                                                    disabled={isLoadingShop}
                                                    className="w-full md:w-auto"
                                                >
                                                    <i
                                                        className="fa-solid fa-floppy-disk pr-2"
                                                        aria-hidden="true"
                                                    ></i>
                                                    {lang['button_save']}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="warning"
                                                type="button"
                                                onClick={handleEdit}
                                                disabled={isLoadingShop}
                                                className="w-full md:w-auto"
                                            >
                                                <i
                                                    className="fa-solid fa-pen-to-square pr-2"
                                                    aria-hidden="true"
                                                ></i>
                                                {lang['button_edit']}
                                            </Button>
                                        )}
                                    </Col>
                                </div>
                                <Form
                                    ref={formRef}
                                    noValidate
                                    validated={validated}
                                    onSubmit={handleSubmit}
                                    aria-label="User shop management form"
                                >
                                    <ShopInfoForm
                                        key={activeShopId}
                                        item={item}
                                        action="edit"
                                        readOnly={!isEditing}
                                    />
                                </Form>
                            </>
                        ) : null
                    )}
                </>
            )}
        </main>
    );
};

UserShopManagementPage.displayName = 'UserShopManagementPage';

export default UserShopManagementPage;
