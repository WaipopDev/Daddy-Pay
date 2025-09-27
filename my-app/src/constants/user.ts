// User Routes
export const USER_ROUTES = {
    LIST: '/user-management',
    ADD: '/user-management/add',
    EDIT: (id: string) => `/user-management/edit/${id}`,
} as const;

// API Endpoints
export const USER_API_ENDPOINTS = {
    BASE: '/api/user',
    GET_BY_ID: (id: string) => `/api/user/by/${id}`,
    DELETE: (userId: string) => `/api/user?userId=${userId}`,
    SHOP_LIST: '/api/shop-info/list-user',
} as const;

// Status values
export const USER_STATUS = {
    ACTIVE: true,
    INACTIVE: false,
} as const;

// User roles
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

// Subscription status
export const USER_SUBSCRIPTION = {
    SUBSCRIBED: true,
    NOT_SUBSCRIBED: false,
} as const;

// Table Configuration
export const USER_TABLE_CONFIG = {
    COLUMN_COUNT: 9,
} as const;