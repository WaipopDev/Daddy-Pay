// Shop Info Routes
export const SHOP_INFO_ROUTES = {
    LIST: '/shop-info',
    ADD: '/shop-info/add',
    EDIT: (id: string) => `/shop-info/edit/${id}`,
} as const;

// API Endpoints
export const SHOP_INFO_API_ENDPOINTS = {
    BASE: '/api/shop-info',
    GET_BY_ID: (id: string) => `/api/shop-info/by/${id}`,
    DELETE: (shopId: string) => `/api/shop-info?shopId=${shopId}`,
} as const;



// Status values
export const SHOP_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
} as const;

// Table Configuration
export const SHOP_INFO_TABLE_CONFIG = {
    COLUMN_COUNT: 11,
} as const;
