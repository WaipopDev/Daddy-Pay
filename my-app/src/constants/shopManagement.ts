export const SHOP_MANAGEMENT_API = {
    LIST: '/api/shop-management',
    BY_ID: (id: string) => `/api/shop-management/by/${id}`,
    TRANSACTIONS: (id: string) => `/api/shop-management/${id}/transactions`,
} as const;
