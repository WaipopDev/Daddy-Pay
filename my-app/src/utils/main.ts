import { PAGINATION_CONFIG } from "@/constants/main";

/**
 * Generates shop row number for pagination
 */
export const getRowNumber = (index: number, currentPage: number, itemsPerPage: number = PAGINATION_CONFIG.ITEMS_PER_PAGE): number => {
    return (currentPage - 1) * itemsPerPage + index + 1;
};
