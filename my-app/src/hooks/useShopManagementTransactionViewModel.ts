'use client';

import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { openModalAlert } from '@/store/features/modalSlice';
import { PAGINATION_CONFIG } from '@/constants/main';
import {
    fetchShopManagementById,
    fetchShopManagementTransactions,
} from '@/services/shopManagementTransactionService';
import type {
    ShopManagementTransactionItem,
    ShopManagementTransactionSearch,
} from '@/types/shopManagementTransactionType';

export const useShopManagementTransactionViewModel = () => {
    const lang = useAppSelector((state) => state.lang) as Record<string, string>;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const shopManagementId = typeof params.id === 'string' ? params.id : '';

    const [items, setItems] = useState<ShopManagementTransactionItem[]>([]);
    const [page, setPage] = useState<{ page: number; totalPages: number }>({
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        totalPages: 1,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [machineName, setMachineName] = useState('');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(),
        new Date(),
    ]);
    const [search, setSearch] = useState<ShopManagementTransactionSearch>({
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
    });

    const loadTransactions = useCallback(
        async (pageNumber: number, searchParams: ShopManagementTransactionSearch) => {
            if (!shopManagementId) return;

            setIsLoading(true);
            try {
                const data = await fetchShopManagementTransactions(
                    shopManagementId,
                    pageNumber,
                    searchParams
                );
                if (data) {
                    setItems(data.items ?? []);
                    setPage({
                        page: data.meta?.currentPage ?? pageNumber,
                        totalPages: data.meta?.totalPages ?? 1,
                    });
                } else {
                    setItems([]);
                    setPage({ page: 1, totalPages: 1 });
                }
            } catch (error) {
                console.error('Error fetching shop management transactions:', error);
                setItems([]);
                setPage({ page: 1, totalPages: 1 });
            } finally {
                setIsLoading(false);
            }
        },
        [shopManagementId]
    );

    const loadMachineInfo = useCallback(async () => {
        if (!shopManagementId) return;
        try {
            const data = await fetchShopManagementById(shopManagementId);
            setMachineName(data?.shopManagementName ?? '');
        } catch {
            setMachineName('');
        }
    }, [shopManagementId]);

    useEffect(() => {
        loadMachineInfo();
    }, [loadMachineInfo]);

    useEffect(() => {
        if (shopManagementId) {
            loadTransactions(1, search);
        }
    }, [shopManagementId]);

    const handleBack = () => {
        router.push('/shop-management');
    };

    const handleSearch = () => {
        if (!dateRange[0] || !dateRange[1]) {
            dispatch(
                openModalAlert({
                    message: lang['global_error_date'],
                    title: lang['global_error'],
                })
            );
            return;
        }
        const nextSearch: ShopManagementTransactionSearch = {
            startDate: moment(dateRange[0]).format('YYYY-MM-DD'),
            endDate: moment(dateRange[1]).format('YYYY-MM-DD'),
        };
        setSearch(nextSearch);
        loadTransactions(1, nextSearch);
    };

    const handlePageChange = (pageNumber: number) => {
        loadTransactions(pageNumber, search);
    };

    const handleDateRangeChange = (value: [Date | null, Date | null]) => {
        setDateRange(value);
    };

    return {
        lang,
        shopManagementId,
        items,
        page,
        isLoading,
        machineName,
        dateRange,
        handleBack,
        handleSearch,
        handlePageChange,
        handleDateRangeChange,
    };
};
