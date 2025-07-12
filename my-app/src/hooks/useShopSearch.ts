import { useState, useCallback, useMemo } from 'react';
import { ShopInfoItemDataProps } from '@/types/shopInfoType';

interface UseShopSearchReturn {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredItems: ShopInfoItemDataProps[] | null;
    handleSearch: (term: string) => void;
    clearSearch: () => void;
}

interface UseShopSearchProps {
    items: ShopInfoItemDataProps[] | null;
    onSearch?: (term: string) => Promise<void>;
}

/**
 * Custom hook for handling shop search functionality
 * Supports both client-side filtering and server-side search
 */
export const useShopSearch = ({ 
    items, 
    onSearch 
}: UseShopSearchProps): UseShopSearchReturn => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = useCallback(async (term: string) => {
        setSearchTerm(term);
        if (onSearch) {
            await onSearch(term);
        }
    }, [onSearch]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    }, [onSearch]);

    // Client-side filtering (fallback if server-side search is not available)
    const filteredItems = useMemo(() => {
        if (!items || !searchTerm.trim()) {
            return items;
        }

        const lowercaseSearch = searchTerm.toLowerCase();
        return items.filter(item => 
            item.shopName.toLowerCase().includes(lowercaseSearch) ||
            item.shopCode.toLowerCase().includes(lowercaseSearch) ||
            item.shopContactInfo.toLowerCase().includes(lowercaseSearch) ||
            item.shopMobilePhone.includes(searchTerm)
        );
    }, [items, searchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        filteredItems,
        handleSearch,
        clearSearch,
    };
};
