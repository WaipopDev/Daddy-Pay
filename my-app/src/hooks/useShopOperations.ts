import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ShopModalDeleteState } from '@/types/shopInfoType';
import { SHOP_INFO_ROUTES, SHOP_INFO_API_ENDPOINTS } from '@/constants/shopInfo';

interface UseShopOperationsReturn {
    showModalDelete: ShopModalDeleteState;
    isDeleting: boolean;
    handleAddShop: () => void;
    handleEditShop: (id: string) => void;
    handleDeleteShop: (id: string) => Promise<void>;
    handleShowDeleteModal: (id: string) => void;
    handleCloseDeleteModal: () => void;
}

interface UseShopOperationsProps {
    onDeleteSuccess?: () => Promise<void>;
}

export const useShopOperations = ({ 
    onDeleteSuccess 
}: UseShopOperationsProps = {}): UseShopOperationsReturn => {
    const router = useRouter();
    const [showModalDelete, setShowModalDelete] = useState<ShopModalDeleteState>({ 
        isShow: false, 
        id: '' 
    });
    const [isDeleting, setIsDeleting] = useState(false);

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

    return {
        showModalDelete,
        isDeleting,
        handleAddShop,
        handleEditShop,
        handleDeleteShop,
        handleShowDeleteModal,
        handleCloseDeleteModal,
    };
};
