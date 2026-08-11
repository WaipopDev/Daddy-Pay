'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface ShopSelectItem {
    id: string;
    shopName: string;
}

interface UserShopSelectProps {
    lang: Record<string, string>;
    shops: ShopSelectItem[];
    value: string;
    onChange: (shopId: string) => void;
    disabled?: boolean;
}

const UserShopSelect: React.FC<UserShopSelectProps> = ({
    lang,
    shops,
    value,
    onChange,
    disabled = false,
}) => {
    const shopOptions = shops.map((shop) => ({
        label: shop.shopName,
        value: shop.id,
    }));

    return (
        <Form.Group className="mb-4 pb-3 border-b border-gray-200">
            <Form.Label className="text-sm md:text-base font-semibold">
                {lang['page_user_shop']}
            </Form.Label>
            <SearchableDropdown
                items={shopOptions}
                value={value}
                onChange={onChange}
                placeholder={lang['page_user_shop_placeholder']}
                searchPlaceholder={lang['global_search']}
                disabled={disabled || shops.length === 0}
                className="nav-dropdown-w max-w-md"
            />
        </Form.Group>
    );
};

export default UserShopSelect;
