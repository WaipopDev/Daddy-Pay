'use client';

import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { cn } from '@/lib/utils';
import type { UserShopListItem } from '@/hooks/useUserShopList';

interface UserShopSelectProps {
    lang: Record<string, string>;
    shops: UserShopListItem[];
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
    const selectedLabel =
        shops.find((shop) => shop.id === value)?.shopName ||
        lang['page_user_shop_placeholder'];

    return (
        <Form.Group className="mb-4 pb-3 border-b border-gray-200">
            <Form.Label className="text-sm md:text-base font-semibold">
                {lang['page_user_shop']}
            </Form.Label>
            <Dropdown className="nav-dropdown-w">
                <Dropdown.Toggle
                    className={cn(
                        'flex items-center w-full min-w-0 px-2 py-2 rounded-md h-[35px] text-sm max-w-md'
                    )}
                    disabled={disabled || shops.length === 0}
                >
                    <p className="px-2 flex-1 min-w-0 text-left text-xs md:text-sm truncate">
                        {selectedLabel}
                    </p>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {shops.map((shop) => (
                        <Dropdown.Item
                            key={shop.id}
                            onClick={() => onChange(shop.id)}
                            active={value === shop.id}
                        >
                            {shop.shopName}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </Form.Group>
    );
};

export default UserShopSelect;
