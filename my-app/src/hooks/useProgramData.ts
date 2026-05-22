import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
    ProgramInfoItem,
    ProgramInfoSearchParams,
} from '@/types/programInfoType';
import { PROGRAM_INFO_API_ENDPOINTS } from '@/constants/programInfo';
import { PAGINATION_CONFIG } from '@/constants/main';

interface UseProgramDataReturn {
    items: ProgramInfoItem[] | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
    fetchData: (pageNumber?: number, search?: ProgramInfoSearchParams) => Promise<void>;
    refreshCurrentPage: () => Promise<void>;
}

interface ProgramInfoPageState {
    item: ProgramInfoItem[] | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
}

const INITIAL_STATE: ProgramInfoPageState = {
    item: null,
    page: { page: PAGINATION_CONFIG.DEFAULT_PAGE, totalPages: 1 },
    isLoading: false,
    error: null,
};

export const useProgramData = (): UseProgramDataReturn => {
    const [state, setState] = useState<ProgramInfoPageState>(INITIAL_STATE);
    const [filters, setFilters] = useState<ProgramInfoSearchParams>({
        programName: '',
        machineType: '',
        machineBrand: '',
    });

    const fetchData = useCallback(async (
        pageNumber: number = 1,
        search?: ProgramInfoSearchParams
    ) => {
        const activeFilters = search ?? filters;
        if (search) {
            setFilters(search);
        }

        setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

        try {
            const response = await axios.get(PROGRAM_INFO_API_ENDPOINTS.BASE, {
                params: {
                    page: pageNumber,
                    programName: activeFilters.programName,
                    machineType: activeFilters.machineType,
                    machineBrand: activeFilters.machineBrand,
                },
            });

            if (response.status === 200) {
                setState({
                    item: response.data.items,
                    page: {
                        page: response.data.meta.currentPage,
                        totalPages: response.data.meta.totalPages,
                    },
                    isLoading: false,
                    error: null,
                });
            }
        } catch (error) {
            console.error('Error fetching program info:', error);
            setState((prevState) => ({
                ...prevState,
                error: 'Error fetching program info',
            }));
        } finally {
            setState((prevState) => ({ ...prevState, isLoading: false }));
        }
    }, [filters]);

    const refreshCurrentPage = useCallback(async () => {
        await fetchData(state.page.page, filters);
    }, [fetchData, state.page.page, filters]);

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
