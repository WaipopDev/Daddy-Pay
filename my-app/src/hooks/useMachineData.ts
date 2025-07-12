import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { ItemMachineInfoDataProps } from '@/types/machineInfoType';
import { PAGINATION_CONFIG } from '@/constants/main';
import { MACHINE_INFO_API_ENDPOINTS } from '@/constants/machineInfo';

interface UseMachineDataReturn {
    items             : ItemMachineInfoDataProps[] | null;
    page              : PageState;
    isLoading         : boolean;
    error             : string | null;
    fetchData         : (pageNumber?: number, search?: string) => Promise<void>;
    refreshCurrentPage: () => Promise<void>;
}
interface MachineInfoPageState {
    item: ItemMachineInfoDataProps[] | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
}

const INITIAL_STATE: MachineInfoPageState = {
    item: null,
    page: { page: PAGINATION_CONFIG.DEFAULT_PAGE, totalPages: 1 },
    isLoading: false,
    error: null,
};
export const useMachineData = (): UseMachineDataReturn => {
    // const [items, setItems] = useState<ItemMachineInfoDataProps[] | null>(null);
    // const [page, setPage] = useState<PageState>({ page: PAGINATION_CONFIG.DEFAULT_PAGE, totalPages: 1 });
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState<MachineInfoPageState>(INITIAL_STATE);

    const fetchData = useCallback(async (pageNumber: number = 1, search: string = '') => {
        setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

        try {
            const response = await axios.get(`${MACHINE_INFO_API_ENDPOINTS.BASE}?page=${pageNumber}&search=${search}`);
            if (response.status === 200) {
                setState({
                    item: response.data.items,
                    page: { page: response.data.meta.currentPage, totalPages: response.data.meta.totalPages },
                    isLoading: false,
                    error: null
                });
            }
        } catch (error) {
            console.error("Error fetching machine info:", error);
            setState((prevState) => ({ ...prevState, error: "Error fetching machine info" }));
        } finally {
            setState((prevState) => ({ ...prevState, isLoading: false }));
        }
    }, []);

    const refreshCurrentPage = useCallback(async () => {
        fetchData(state.page.page);
    }, [fetchData, state.page.page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return {
        items    : state.item,
        page     : state.page,
        isLoading: state.isLoading,
        error    : state.error,
        fetchData,
        refreshCurrentPage
    };
}