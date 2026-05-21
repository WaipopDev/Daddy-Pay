import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    ShopInfoItemDataProps,
    ShopModalDeleteState,
    ShopModalOnlinePaymentState,
    ShopModalSubscriptionState,
    ShopOnlinePaymentFormData,
    ShopSubscriptionFormData,
} from '@/types/shopInfoType';
import { useAppDispatch } from '@/store/hook';
import { openModalAlert } from '@/store/features/modalSlice';
import { AxiosError } from 'axios';
import {
    SHOP_INFO_ROUTES,
    SHOP_INFO_API_ENDPOINTS,
    isOnlinePaymentStatus,
    isSubscriptionStatus,
} from '@/constants/shopInfo';

interface BankFormData {
    consumerId: string;
    consumerSecret: string;
    partnerId: string;
    merchantId: string;
    partnerSecret: string;
    bankActiveName: string;
    bankActiveId: string | null;
}

interface ShopModalBankState {
    isShow: boolean;
    shopId: string;
    initialData?: BankFormData;
}

interface UseShopOperationsReturn {
    showModalDelete: ShopModalDeleteState;
    showModalBank: ShopModalBankState;
    showModalOnlinePayment: ShopModalOnlinePaymentState;
    showModalSubscription: ShopModalSubscriptionState;
    isDeleting: boolean;
    isSavingBank: boolean;
    isSavingOnlinePayment: boolean;
    isSavingSubscription: boolean;
    handleAddShop: () => void;
    handleEditShop: (id: string) => void;
    handleDeleteShop: (id: string) => Promise<void>;
    handleShowDeleteModal: (id: string) => void;
    handleCloseDeleteModal: () => void;
    handleShowBankModal: (shopId: string, initialData?: BankFormData) => void;
    handleCloseBankModal: () => void;
    handleSaveBank: (shopId: string, bankData: BankFormData) => Promise<void>;
    handleShowOnlinePaymentModal: (item: ShopInfoItemDataProps) => void;
    handleCloseOnlinePaymentModal: () => void;
    handleSaveOnlinePayment: (
        shopId: string,
        data: ShopOnlinePaymentFormData
    ) => Promise<void>;
    handleShowSubscriptionModal: (item: ShopInfoItemDataProps) => void;
    handleCloseSubscriptionModal: () => void;
    handleSaveSubscription: (
        shopId: string,
        data: ShopSubscriptionFormData
    ) => Promise<void>;
}

interface UseShopOperationsProps {
    onDeleteSuccess?: () => Promise<void>;
    onBankSaveSuccess?: () => Promise<void>;
    onOnlinePaymentSaveSuccess?: () => Promise<void>;
    onSubscriptionSaveSuccess?: () => Promise<void>;
    lang?: Record<string, string>;
}

export const useShopOperations = ({
    onDeleteSuccess,
    onBankSaveSuccess,
    onOnlinePaymentSaveSuccess,
    onSubscriptionSaveSuccess,
    lang = {},
}: UseShopOperationsProps = {}): UseShopOperationsReturn => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showModalDelete, setShowModalDelete] = useState<ShopModalDeleteState>({ 
        isShow: false, 
        id: '' 
    });
    const [showModalBank, setShowModalBank] = useState<ShopModalBankState>({
        isShow: false,
        shopId: '',
        initialData: undefined
    });
    const [showModalOnlinePayment, setShowModalOnlinePayment] =
        useState<ShopModalOnlinePaymentState>({
            isShow: false,
            shopId: '',
            initialData: undefined,
        });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingBank, setIsSavingBank] = useState(false);
    const [showModalSubscription, setShowModalSubscription] =
        useState<ShopModalSubscriptionState>({
            isShow: false,
            shopId: '',
            initialData: undefined,
        });
    const [isSavingOnlinePayment, setIsSavingOnlinePayment] = useState(false);
    const [isSavingSubscription, setIsSavingSubscription] = useState(false);

    const fetchBankData = useCallback(async (id: string): Promise<BankFormData | undefined> => {
        try {
            const response = await axios.get(`${SHOP_INFO_API_ENDPOINTS.BANK(id)}`);
            if (response.status === 200 && response.data && response.data.bankActiveId) {
                console.log('esponse.data', response.data)
                const { consumerId, consumerSecret, partnerId, merchantId, partnerSecret, bankActiveName } = response.data.bankActive.param;
                return {
                    consumerId: consumerId,
                    consumerSecret: consumerSecret,
                    partnerId: partnerId,
                    merchantId: merchantId,
                    partnerSecret: partnerSecret,
                    bankActiveName: bankActiveName,
                    bankActiveId: response.data.bankActiveId
                } as BankFormData;
            }
            return undefined;
        } catch (error) {
            console.error("Error fetching bank info:", error);
            return undefined;
        }

    }, []);

    const handleAddShop = useCallback(() => {
        router.push(SHOP_INFO_ROUTES.ADD);
    }, [router]);

    const handleEditShop = useCallback((id: string) => {
        router.push(SHOP_INFO_ROUTES.EDIT(id));
    }, [router]);

    const handleDeleteShop = useCallback(async (id: string) => {
        try {
            setIsDeleting(true);
            const response = await axios.delete(SHOP_INFO_API_ENDPOINTS.DELETE(id));
            
            if (response.status === 200) {
                setShowModalDelete({ isShow: false, id: '' });
                if (onDeleteSuccess) {
                    await onDeleteSuccess();
                }
            }
        } catch (error) {
            console.error("Error deleting shop:", error);
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

    const handleShowBankModal = useCallback(async(shopId: string) => {
        const initialData = await fetchBankData(shopId);
        console.log('initialData', initialData)
        setShowModalBank({
            isShow: true,
            shopId,
            initialData: initialData || undefined
        });
    }, []);

    const handleCloseBankModal = useCallback(() => {
        setShowModalBank({
            isShow: false,
            shopId: '',
            initialData: undefined
        });
    }, []);

    

    const handleSaveBank = useCallback(async (shopId: string, bankData: BankFormData) => {
        try {
            setIsSavingBank(true);
            bankData.bankActiveName = 'KBANK';
            const response = await axios.post(`/api/shop-info/bank/${shopId}`, bankData);
            
            if (response.status === 200) {
                handleCloseBankModal();
                if (onBankSaveSuccess) {
                    await onBankSaveSuccess();
                }
            }
        } catch (error) {
            console.error("Error saving bank information:", error);
            // TODO: Add proper error handling/notification
        } finally {
            setIsSavingBank(false);
        }
    }, [onBankSaveSuccess, handleCloseBankModal]);

    const handleShowOnlinePaymentModal = useCallback((item: ShopInfoItemDataProps) => {
        setShowModalOnlinePayment({
            isShow: true,
            shopId: item.id,
            initialData: {
                onlinePaymentStatus: isOnlinePaymentStatus(item.onlinePaymentStatus)
                    ? item.onlinePaymentStatus
                    : '',
                onlineActivationDate: item.onlineActivationDate || '',
                onlineCloseDate: item.onlineCloseDate || '',
            },
        });
    }, []);

    const handleCloseOnlinePaymentModal = useCallback(() => {
        setShowModalOnlinePayment({
            isShow: false,
            shopId: '',
            initialData: undefined,
        });
    }, []);

    const handleSaveOnlinePayment = useCallback(
        async (shopId: string, data: ShopOnlinePaymentFormData) => {
            try {
                setIsSavingOnlinePayment(true);
                const response = await axios.patch(
                    SHOP_INFO_API_ENDPOINTS.ONLINE_PAYMENT(shopId),
                    data
                );

                if (response.status === 200) {
                    handleCloseOnlinePaymentModal();
                    dispatch(
                        openModalAlert({
                            message: lang['global_success'] || 'Success',
                            title: lang['global_success'] || 'Success',
                        })
                    );
                    if (onOnlinePaymentSaveSuccess) {
                        await onOnlinePaymentSaveSuccess();
                    }
                }
            } catch (error) {
                const err = error as AxiosError;
                const errorMessage =
                    (err.response?.data as { message?: string })?.message ||
                    lang['global_error_message'] ||
                    'Failed to update online payment';
                dispatch(
                    openModalAlert({
                        message: errorMessage,
                        title: lang['global_error'] || 'Error',
                    })
                );
            } finally {
                setIsSavingOnlinePayment(false);
            }
        },
        [
            dispatch,
            handleCloseOnlinePaymentModal,
            lang,
            onOnlinePaymentSaveSuccess,
        ]
    );

    const handleShowSubscriptionModal = useCallback((item: ShopInfoItemDataProps) => {
        const cycle = Number(item.subNotificationCycle);
        setShowModalSubscription({
            isShow: true,
            shopId: item.id,
            initialData: {
                subSubscriptionStatus: isSubscriptionStatus(item.subSubscriptionStatus)
                    ? item.subSubscriptionStatus
                    : '',
                subRegistrationDate: item.subRegistrationDate || '',
                subExpirationDate: item.subExpirationDate || '',
                subNotificationCycle:
                    Number.isInteger(cycle) && cycle >= 1 && cycle <= 90 ? cycle : '',
                subNotifyToEmail: item.subNotifyToEmail || '',
            },
        });
    }, []);

    const handleCloseSubscriptionModal = useCallback(() => {
        setShowModalSubscription({
            isShow: false,
            shopId: '',
            initialData: undefined,
        });
    }, []);

    const handleSaveSubscription = useCallback(
        async (shopId: string, data: ShopSubscriptionFormData) => {
            try {
                setIsSavingSubscription(true);
                const response = await axios.patch(
                    SHOP_INFO_API_ENDPOINTS.SUBSCRIPTION(shopId),
                    {
                        ...data,
                        subNotificationCycle: Number(data.subNotificationCycle),
                    }
                );

                if (response.status === 200) {
                    handleCloseSubscriptionModal();
                    dispatch(
                        openModalAlert({
                            message: lang['global_success'] || 'Success',
                            title: lang['global_success'] || 'Success',
                        })
                    );
                    if (onSubscriptionSaveSuccess) {
                        await onSubscriptionSaveSuccess();
                    }
                }
            } catch (error) {
                const err = error as AxiosError;
                const errorMessage =
                    (err.response?.data as { message?: string })?.message ||
                    lang['global_error_message'] ||
                    'Failed to update subscription';
                dispatch(
                    openModalAlert({
                        message: errorMessage,
                        title: lang['global_error'] || 'Error',
                    })
                );
            } finally {
                setIsSavingSubscription(false);
            }
        },
        [
            dispatch,
            handleCloseSubscriptionModal,
            lang,
            onSubscriptionSaveSuccess,
        ]
    );

    return {
        showModalDelete,
        showModalBank,
        showModalOnlinePayment,
        showModalSubscription,
        isDeleting,
        isSavingBank,
        isSavingOnlinePayment,
        isSavingSubscription,
        handleAddShop,
        handleEditShop,
        handleDeleteShop,
        handleShowDeleteModal,
        handleCloseDeleteModal,
        handleShowBankModal,
        handleCloseBankModal,
        handleSaveBank,
        handleShowOnlinePaymentModal,
        handleCloseOnlinePaymentModal,
        handleSaveOnlinePayment,
        handleShowSubscriptionModal,
        handleCloseSubscriptionModal,
        handleSaveSubscription,
    };
};
