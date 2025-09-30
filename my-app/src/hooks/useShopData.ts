import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
    ShopInfoItemDataProps
} from '@/types/shopInfoType';
import { SHOP_INFO_API_ENDPOINTS } from '@/constants/shopInfo';
import { PAGINATION_CONFIG } from '@/constants/main';

interface UseShopDataReturn {
    items: ShopInfoItemDataProps[] | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
    fetchData: (pageNumber?: number, search?: string) => Promise<void>;
    refreshCurrentPage: () => Promise<void>;
}
interface ShopInfoPageState {
    item: ShopInfoItemDataProps[] | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
}

const INITIAL_STATE: ShopInfoPageState = {
    item: null,
    page: { page: PAGINATION_CONFIG.DEFAULT_PAGE, totalPages: 1 },
    isLoading: false,
    error: null,
};

export const useShopData = (): UseShopDataReturn => {
    // const [items, setItems] = useState<ShopInfoItemDataProps[] | null>(null);
    // const [page, setPage] = useState<PageState>({ 
    //     page: PAGINATION_CONFIG.DEFAULT_PAGE, 
    //     totalPages: 1 
    // });
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState<ShopInfoPageState>(INITIAL_STATE);

    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

            const response = await axios.get(`${SHOP_INFO_API_ENDPOINTS.BASE}?page=${pageNumber}&search=${search}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setState({
                    item: response.data.items,
                    page: {
                        page: response.data.meta.currentPage,
                        totalPages: response.data.meta.totalPages
                    },
                    isLoading: false,
                    error: null
                });
            }
        } catch (error) {
            console.error("Error fetching shop info:", error);
            setState((prevState) => ({ ...prevState, error: "Failed to fetch shop information" }));
        } finally {
            setState((prevState) => ({ ...prevState, isLoading: false }));
        }
    }, []);
    

    const refreshCurrentPage = useCallback(async () => {
        await fetchData(state.page.page);
    }, [fetchData, state.page.page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        items: state.item,
        page: state.page,
        isLoading: state.isLoading,
        error: state.error,
        fetchData,
        refreshCurrentPage,
    };
};
