import { PAGINATION_CONFIG } from "@/constants/main";

/**
 * Generates shop row number for pagination
 */
export const getRowNumber = (index: number, currentPage: number, itemsPerPage: number = PAGINATION_CONFIG.ITEMS_PER_PAGE): number => {
    return (currentPage - 1) * itemsPerPage + index + 1;
};

export const formatNumber = (number: number = 0): string => {
    // format comma to number
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const noIndex = (page: number, index: number, itemsPerPage: number = PAGINATION_CONFIG.ITEMS_PER_PAGE): number => {
    return (page - 1) * itemsPerPage + index + 1;
};