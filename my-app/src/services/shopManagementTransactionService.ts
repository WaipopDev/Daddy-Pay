import axios from 'axios';
import { PAGINATION_CONFIG } from '@/constants/main';
import { SHOP_MANAGEMENT_API } from '@/constants/shopManagement';
import type {
    ShopManagementTransactionResponse,
    ShopManagementTransactionSearch,
} from '@/types/shopManagementTransactionType';

export const fetchShopManagementById = async (id: string) => {
    const response = await axios.get(SHOP_MANAGEMENT_API.BY_ID(id));
    return response.data as { shopManagementName?: string };
};

export const fetchShopManagementTransactions = async (
    shopManagementId: string,
    pageNumber: number,
    search: ShopManagementTransactionSearch
): Promise<ShopManagementTransactionResponse | null> => {
    const response = await axios.get(SHOP_MANAGEMENT_API.TRANSACTIONS(shopManagementId), {
        params: {
            startDate: search.startDate,
            endDate: search.endDate,
            page: pageNumber,
            limit: PAGINATION_CONFIG.ITEMS_PER_PAGE,
        },
    });

    if (response.status === 200 && response.data) {
        return response.data as ShopManagementTransactionResponse;
    }
    return null;
};
