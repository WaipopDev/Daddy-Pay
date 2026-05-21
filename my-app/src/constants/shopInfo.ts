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
    GET_BY_ID_API: (id: string) => `/api/shop-info/by-id/${id}`,
    DELETE: (shopId: string) => `/api/shop-info?shopId=${shopId}`,
    BANK: (id: string) => `/api/shop-info/bank/${id}`,
    ONLINE_PAYMENT: (id: string) => `/api/shop-info/online-payment/${id}`,
    SUBSCRIPTION: (id: string) => `/api/shop-info/subscription/${id}`,
} as const;



// Status values
export const SHOP_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ALL: '',
} as const;

export const ONLINE_PAYMENT_STATUS = {
    ENABLE: 'enable',
    DISABLE: 'disable',
} as const;

export type OnlinePaymentStatusValue =
    (typeof ONLINE_PAYMENT_STATUS)[keyof typeof ONLINE_PAYMENT_STATUS];

export const ONLINE_PAYMENT_STATUS_VALUES: readonly OnlinePaymentStatusValue[] = [
    ONLINE_PAYMENT_STATUS.ENABLE,
    ONLINE_PAYMENT_STATUS.DISABLE,
];

export const isOnlinePaymentStatus = (
    value: string
): value is OnlinePaymentStatusValue =>
    (ONLINE_PAYMENT_STATUS_VALUES as readonly string[]).includes(value);

export const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
} as const;

export type SubscriptionStatusValue =
    (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const SUBSCRIPTION_STATUS_VALUES: readonly SubscriptionStatusValue[] = [
    SUBSCRIPTION_STATUS.ACTIVE,
    SUBSCRIPTION_STATUS.EXPIRED,
];

export const isSubscriptionStatus = (
    value: string
): value is SubscriptionStatusValue =>
    (SUBSCRIPTION_STATUS_VALUES as readonly string[]).includes(value);

export const SUBSCRIPTION_NOTIFICATION_CYCLE = {
    MIN: 1,
    MAX: 90,
} as const;

export const getSubscriptionStatusOptions = (lang: Record<string, string>) => [
    { value: SUBSCRIPTION_STATUS.ACTIVE, label: lang['global_active'] },
    { value: SUBSCRIPTION_STATUS.EXPIRED, label: lang['global_expired'] },
] as const;

export const getSubscriptionNotificationCycleOptions = (lang: Record<string, string>) =>
    Array.from({ length: SUBSCRIPTION_NOTIFICATION_CYCLE.MAX }, (_, index) => {
        const days = index + SUBSCRIPTION_NOTIFICATION_CYCLE.MIN;
        return {
            value: String(days),
            label: `${days} ${lang['page_shop_info_notification_cycle_unit']}`,
        };
    });

export const getOnlinePaymentStatusOptions = (lang: Record<string, string>) => [
    { value: ONLINE_PAYMENT_STATUS.ENABLE, label: lang['global_enable'] },
    { value: ONLINE_PAYMENT_STATUS.DISABLE, label: lang['global_disable'] },
] as const;

export const getShopStatusFilterOptions = (lang: Record<string, string>) => [
    { value: SHOP_STATUS.ALL, label: lang['global_all'] },
    { value: SHOP_STATUS.ACTIVE, label: lang['global_active'] },
    { value: SHOP_STATUS.INACTIVE, label: lang['global_inactive'] },
] as const;

// Table Configuration
export const SHOP_INFO_TABLE_CONFIG = {
    COLUMN_COUNT: 11,
} as const;
