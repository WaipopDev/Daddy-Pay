// User Routes
export const USER_ROUTES = {
    LIST: '/user-management',
    ADD: '/user-management/add',
    EDIT: (id: string) => `/user-management/edit/${id}`,
} as const;

// API Endpoints
export const USER_API_ENDPOINTS = {
    BASE: '/api/user',
    ME: '/api/user/me',
    GET_BY_ID: (id: string) => `/api/user/by/${id}`,
    DELETE: (userId: string) => `/api/user?userId=${userId}`,
    SUBSCRIBE: (userId: string) => `/api/user/subscribe/${userId}`,
    SHOP_LIST: '/api/shop-info/list-user',
} as const;

export const USER_SUBSCRIBE_STATUS = {
    SUBSCRIBED: 'true',
    NOT_SUBSCRIBED: 'false',
} as const;

export const USER_VERIFIED_STATUS = {
    VERIFIED: 'true',
    UNVERIFIED: 'false',
} as const;

export const getUserSubscribeFilterOptions = (lang: Record<string, string>) => [
    { value: '', label: lang['global_all'] || 'All' },
    {
        label: lang['page_user_subscribed'] || 'Subscribed',
        value: USER_SUBSCRIBE_STATUS.SUBSCRIBED,
    },
    {
        label: lang['page_user_not_subscribed'] || 'Not Subscribed',
        value: USER_SUBSCRIBE_STATUS.NOT_SUBSCRIBED,
    },
];

export const getUserSubscribeStatusOptions = (lang: Record<string, string>) =>
    getUserSubscribeFilterOptions(lang).filter((item) => item.value !== '');

export const getUserVerifiedFilterOptions = (lang: Record<string, string>) => [
    { value: '', label: lang['global_all'] || 'All' },
    {
        label: lang['global_verified'] || 'Verified',
        value: USER_VERIFIED_STATUS.VERIFIED,
    },
    {
        label: lang['global_unverified'] || 'Unverified',
        value: USER_VERIFIED_STATUS.UNVERIFIED,
    },
];

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