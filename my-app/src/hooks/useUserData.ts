import { useCallback, useEffect, useState } from "react";
import { PAGINATION_CONFIG } from "@/constants/main";
import { UserDataItemDataProps } from "@/types/userType";
import axios from "axios";
import { USER_API_ENDPOINTS } from "@/constants/user";


interface UseUserDataReturn {
    items: UserDataItemDataProps[] | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
    fetchData: (pageNumber?: number, search?: string) => Promise<void>;
    refreshCurrentPage: () => Promise<void>;
}

interface UserDataState {
    items: UserDataItemDataProps[] | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
}

const INITIAL_STATE: UserDataState = {
    items: null,
    page: { page: PAGINATION_CONFIG.DEFAULT_PAGE, totalPages: 1 },
    isLoading: false,
    error: null,
};

export const useUserData = (): UseUserDataReturn => {
    const [state, setState] = useState<UserDataState>(INITIAL_STATE);

    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        try {
            setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
            const response = await axios.get(`${USER_API_ENDPOINTS.BASE}?page=${pageNumber}&search=${search}`);
            if (response.status === 200) {
                setState({
                    items: response.data.items,
                    page: { page: response.data.meta.currentPage, totalPages: response.data.meta.totalPages },
                    isLoading: false,
                    error: null
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setState((prevState) => ({ ...prevState, error: "Failed to fetch user data" }));
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
        items: state.items,
        page: state.page,
        isLoading: state.isLoading,
        error: state.error,
        fetchData,
        refreshCurrentPage,
    };
}

export const useShopInfoList = (): { itemShop: {id:string, shopName:string}[] | [] } => {
    const [itemShop, setItemShop] = useState<{id:string, shopName:string}[] | []>([]);
    const fetchShopListData = useCallback(async () => {
        try {
            const response = await axios.get(USER_API_ENDPOINTS.SHOP_LIST);
            if (response.status === 200) {
                setItemShop(response.data);
            }
        } catch (error) {
            console.error("Error fetching shop list:", error);
        }
    }, []);

    useEffect(() => {
        fetchShopListData();
    }, [fetchShopListData]);

    return {
        itemShop,
    }
}