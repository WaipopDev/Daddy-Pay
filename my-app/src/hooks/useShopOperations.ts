import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ShopModalDeleteState } from '@/types/shopInfoType';
import { SHOP_INFO_ROUTES, SHOP_INFO_API_ENDPOINTS } from '@/constants/shopInfo';

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
    isDeleting: boolean;
    isSavingBank: boolean;
    handleAddShop: () => void;
    handleEditShop: (id: string) => void;
    handleDeleteShop: (id: string) => Promise<void>;
    handleShowDeleteModal: (id: string) => void;
    handleCloseDeleteModal: () => void;
    handleShowBankModal: (shopId: string, initialData?: BankFormData) => void;
    handleCloseBankModal: () => void;
    handleSaveBank: (shopId: string, bankData: BankFormData) => Promise<void>;
}

interface UseShopOperationsProps {
    onDeleteSuccess?: () => Promise<void>;
    onBankSaveSuccess?: () => Promise<void>;
}

export const useShopOperations = ({ 
    onDeleteSuccess,
    onBankSaveSuccess 
}: UseShopOperationsProps = {}): UseShopOperationsReturn => {
    const router = useRouter();
    const [showModalDelete, setShowModalDelete] = useState<ShopModalDeleteState>({ 
        isShow: false, 
        id: '' 
    });
    const [showModalBank, setShowModalBank] = useState<ShopModalBankState>({
        isShow: false,
        shopId: '',
        initialData: undefined
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingBank, setIsSavingBank] = useState(false);

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

    return {
        showModalDelete,
        showModalBank,
        isDeleting,
        isSavingBank,
        handleAddShop,
        handleEditShop,
        handleDeleteShop,
        handleShowDeleteModal,
        handleCloseDeleteModal,
        handleShowBankModal,
        handleCloseBankModal,
        handleSaveBank,
    };
};
