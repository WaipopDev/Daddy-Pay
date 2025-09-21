import { UserDataItemDataProps } from '@/types/userType';

/**
 * User Info utility functions
 */

/**
 * Generates table headers for user info table
 */
export const getUserInfoTableHeaders = (lang: { [key: string]: string }): string[] => {
    return [
        '#', 
        lang['page_user_username'] || 'Username', 
        lang['page_user_email'] || 'Email', 
        lang['global_status'] || 'Status', 
        lang['page_user_role'] || 'Role',
        lang['page_user_subscription'] || 'Subscription',
        lang['page_user_verified'] || 'Verified',
        lang['global_action'] || 'Action',
    ];
};

/**
 * Formats user status for display
 */
export const formatUserStatus = (isActive: boolean, lang: { [key: string]: string }) => {
    return {
        text: isActive ? (lang['global_active'] || 'Active') : (lang['global_inactive'] || 'Inactive'),
        className: isActive ? 'bg-success' : 'bg-danger',
        isActive
    };
};

/**
 * Formats user role for display
 */
export const formatUserRole = (role: string, lang: { [key: string]: string }) => {
    const roleMap: { [key: string]: { text: string; className: string } } = {
        'admin': { 
            text: lang['page_user_role_admin'] || 'Admin', 
            className: 'bg-danger' 
        },
        'user': { 
            text: lang['page_user_role_user'] || 'User', 
            className: 'bg-primary' 
        },
    };
    
    return roleMap[role] || { 
        text: role, 
        className: 'bg-secondary' 
    };
};

/**
 * Formats user subscription status for display
 */
export const formatUserSubscription = (isSubscribed: boolean, lang: { [key: string]: string }) => {
    return {
        text: isSubscribed ? (lang['page_user_subscribed'] || 'Subscribed') : (lang['page_user_not_subscribed'] || 'Not Subscribed'),
        className: isSubscribed ? 'bg-success' : 'bg-secondary',
        isSubscribed
    };
};

/**
 * Filters users by search term
 */
export const filterUsersBySearch = (
    users: UserDataItemDataProps[], 
    searchTerm: string
): UserDataItemDataProps[] => {
    if (!searchTerm.trim()) return users;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return users.filter(user => 
        user.username.toLowerCase().includes(lowercaseSearch) ||
        user.email.toLowerCase().includes(lowercaseSearch) ||
        user.role.toLowerCase().includes(lowercaseSearch)
    );
};
