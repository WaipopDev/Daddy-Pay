import { useCallback, useEffect, useState } from 'react'
import { ReportBankPaymentItemDataProps, ReportBranchIncomeItemDataProps } from '@/types/reportType';
import { PAGINATION_CONFIG } from '@/constants/main';
import axios from 'axios';
import { REPORT_API_ENDPOINTS } from '@/constants/report';
import moment from 'moment';

export interface SearchParams {
    branchId?: string;
    paymentType?: string;
    machineName?: string;
    programName?: string;
    startDate?: string;
    endDate?: string;
}

interface ReportDataReturn {
    items: ReportBranchIncomeItemDataProps[] | null;
    summary: string | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
    fetchData: (pageNumber?: number, search?: SearchParams) => Promise<void>;
    refreshCurrentPage: () => Promise<void>;
    fetchDataExcel: (pageNumber?: number, search?: SearchParams) => Promise<ReportBranchIncomeItemDataProps[] | null>;
}
interface ReportDataReturnBank {
    items: ReportBankPaymentItemDataProps[] | null;
    summary: string | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
    fetchData: (pageNumber?: number, search?: SearchParams) => Promise<void>;
    refreshCurrentPage: () => Promise<void>;
    fetchDataExcel: (pageNumber?: number, search?: SearchParams) => Promise<ReportBankPaymentItemDataProps[] | null>;
}
interface ReportDataState {
    item: ReportBranchIncomeItemDataProps[] | null;
    summary: string | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
}

interface ReportDataBankState {
    item: ReportBankPaymentItemDataProps[] | null;
    summary: string | null;
    page: PageState;
    isLoading: boolean;
    error: string | null;
}

const INITIAL_STATE: ReportDataState = {
    item: null,
    summary: null,
    page: { page: PAGINATION_CONFIG.DEFAULT_PAGE, totalPages: 1 },
    isLoading: false,
    error: null,
};

const INITIAL_STATE_BANK: ReportDataBankState = {
    item: null,
    summary: null,
    page: { page: PAGINATION_CONFIG.DEFAULT_PAGE, totalPages: 1 },
    isLoading: false,
    error: null,
};

export const useReportData = (): ReportDataReturn => {
    const [state, setState] = useState<ReportDataState>(INITIAL_STATE);

    const fetchData = useCallback(async (pageNumber: number = 1, search: SearchParams = {}) => {
        try {
            setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
            const response = await axios.get(`${REPORT_API_ENDPOINTS.BRANCH_INCOME}`,
                {
                    params: {
                        page: pageNumber.toString(),
                        branchId: search.branchId || '',
                        paymentType: search.paymentType || '',
                        machineName: search.machineName || '',
                        programName: search.programName || '',
                        startDate: search.startDate || '',
                        endDate: search.endDate || '',
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const responseSummary = await axios.get(`${REPORT_API_ENDPOINTS.BRANCH_INCOME_SUMMARY}`,
                {
                    params: {
                        page:1,
                        branchId: search.branchId || '',
                        paymentType: search.paymentType || '',
                        machineName: search.machineName || '',
                        programName: search.programName || '',
                        startDate: search.startDate || '',
                        endDate: search.endDate || '',
                    },
                }
            );

            if (response.status === 200 && responseSummary.status === 200) {
                setState({
                    item: response.data.items,
                    summary: responseSummary.data.totalPrice,
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

    const fetchDataExcel = useCallback(async (pageNumber: number = 1, search: SearchParams = {}) => {
        try {
            const response = await axios.get(`${REPORT_API_ENDPOINTS.BRANCH_INCOME}`,
                {
                    params: {
                        page: pageNumber.toString(),
                        branchId: search.branchId || '',
                        paymentType: search.paymentType || '',
                        machineName: search.machineName || '',
                        programName: search.programName || '',
                        startDate: search.startDate || '',
                        endDate: search.endDate || '',
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                return response.data.items;
            }
            return null;
        } catch (error) {
            console.error("Error fetching shop info:", error);
            return null;
        }
    },[]);

    const refreshCurrentPage = useCallback(async () => {
        await fetchData(state.page.page);
    }, [fetchData, state.page.page]);

    useEffect(() => {
        const search: SearchParams = {
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
        }
        fetchData(1, search);
    }, [fetchData]);

    return {
        items: state.item,
        summary: state.summary,
        page: state.page,
        isLoading: state.isLoading,
        error: state.error,
        fetchData,
        refreshCurrentPage,
        fetchDataExcel,
    };
}


export const useReportDataBank = (): ReportDataReturnBank => {
    const [state, setState] = useState<ReportDataBankState>(INITIAL_STATE_BANK);

    const fetchData = useCallback(async (pageNumber: number = 1, search: SearchParams = {}) => {
        try {
            setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
            const response = await axios.get(`${REPORT_API_ENDPOINTS.KBANK_PAYMENT}`,
                {
                    params: {
                        page: pageNumber.toString(),
                        branchId: search.branchId || '',
                        startDate: search.startDate || '',
                        endDate: search.endDate || '',
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const responseSummary = await axios.get(`${REPORT_API_ENDPOINTS.KBANK_PAYMENT_SUMMARY}`,
                {
                    params: {
                        page:1,
                        branchId: search.branchId || '',
                        startDate: search.startDate || '',
                        endDate: search.endDate || '',
                    },
                }
            );
            if (response.status === 200 && responseSummary.status === 200) {
                setState({
                    item: response.data,
                    summary: responseSummary.data.totalPrice,
                    page: { 
                        page: 1, 
                        totalPages: 1
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

    const fetchDataExcel = useCallback(async (pageNumber: number = 1, search: SearchParams = {}) => {
        try {
            const response = await axios.get(`${REPORT_API_ENDPOINTS.KBANK_PAYMENT}`,
                {
                    params: {
                        page: pageNumber.toString(),
                        branchId: search.branchId || '',
                        startDate: search.startDate || '',
                        endDate: search.endDate || '',
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error("Error fetching shop info:", error);
            return null;
        }
    },[])

    const refreshCurrentPage = useCallback(async () => {
        await fetchData(state.page.page);
    }, [fetchData, state.page.page]);

    useEffect(() => {
        const search: SearchParams = {
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
        }
        fetchData(1, search);
    }, [fetchData]);

    return {
        items: state.item,
        summary: state.summary,
        page: state.page,
        isLoading: state.isLoading,
        error: state.error,
        fetchData,
        refreshCurrentPage,
        fetchDataExcel
    };
}