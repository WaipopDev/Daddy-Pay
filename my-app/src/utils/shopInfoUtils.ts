import moment from 'moment';
import { ShopInfoItemDataProps } from '@/types/shopInfoType';
import {
    ONLINE_PAYMENT_STATUS,
    SHOP_STATUS,
    SUBSCRIPTION_STATUS,
} from '@/constants/shopInfo';

/**
 * Shop Info utility functions
 */

export const formatShopInfoDate = (value?: string): string => {
    if (!value) return '-';
    const parsed = moment(value, ['YYYY-MM-DD', moment.ISO_8601], true);
    return parsed.isValid() ? parsed.format('DD-MM-YYYY') : value;
};

/**
 * Generates table headers for shop info table
 */
export const getShopInfoTableHeaders = (lang: { [key: string]: string }): string[] => {
    return [
        '#', 
        lang['page_shop_info_shop_code'], 
        lang['page_shop_info_shop_name'], 
        lang['global_status'], 
        lang['page_shop_info_online_payment_status'],
        lang['page_shop_info_registration_date'],
        lang['page_shop_info_expiration_date'],
        lang['page_shop_info_subscription_status'],
        lang['page_shop_info_contact_info'],
        lang['page_shop_info_contact_number'],
        lang['global_action'],
    ];
};

/**
 * Validates if shop data is valid
 */
// export const isValidShopData = (items: any[]): items is ShopInfoItemDataProps[] => {
//     return Array.isArray(items) && items.length > 0;
// };

/**
 * Formats shop status for display
 */
export const formatShopStatus = (status: string, lang: { [key: string]: string }) => {
    const isActive = status === SHOP_STATUS.ACTIVE;
    return {
        text: isActive ? lang['global_active'] : lang['global_inactive'],
        className: isActive ? 'text-success' : 'text-danger',
        isActive
    };
};

/**
 * Formats online payment status for display (enable | disable)
 */
export const formatOnlinePaymentStatus = (
    status: string,
    lang: { [key: string]: string }
) => {
    const normalized = status?.toLowerCase();
    const isEnabled = normalized === ONLINE_PAYMENT_STATUS.ENABLE;
    const isDisabled = normalized === ONLINE_PAYMENT_STATUS.DISABLE;

    return {
        text: isEnabled
            ? lang['global_enable']
            : isDisabled
              ? lang['global_disable']
              : status || '-',
        className: isEnabled
            ? 'text-success'
            : isDisabled
              ? 'text-danger'
              : 'text-muted',
        isEnabled,
    };
};

/**
 * Formats subscription status for display (active | expired)
 */
export const formatSubscriptionStatus = (
    status: string,
    lang: { [key: string]: string }
) => {
    const normalized = status?.toLowerCase();
    const isActive = normalized === SUBSCRIPTION_STATUS.ACTIVE;
    const isExpired = normalized === SUBSCRIPTION_STATUS.EXPIRED;

    return {
        text: isActive
            ? lang['global_active']
            : isExpired
              ? lang['global_expired']
              : status || '-',
        className: isActive
            ? 'text-success'
            : isExpired
              ? 'text-danger'
              : 'text-muted',
        isActive,
    };
};

/**
 * Filters shops by search term
 */
export const filterShopsBySearch = (
    shops: ShopInfoItemDataProps[], 
    searchTerm: string
): ShopInfoItemDataProps[] => {
    if (!searchTerm.trim()) return shops;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return shops.filter(shop => 
        shop.shopName.toLowerCase().includes(lowercaseSearch) ||
        shop.shopCode.toLowerCase().includes(lowercaseSearch) ||
        shop.shopContactInfo.toLowerCase().includes(lowercaseSearch) ||
        shop.shopMobilePhone.includes(searchTerm)
    );
};

