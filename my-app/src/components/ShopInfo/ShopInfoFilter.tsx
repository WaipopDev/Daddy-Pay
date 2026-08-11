'use client';

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getShopStatusFilterOptions } from '@/constants/shopInfo';
import type { ShopInfoSearchParams } from '@/types/shopInfoType';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface ShopInfoFilterProps {
    lang: Record<string, string>;
    isLoading?: boolean;
    onSearch: (filters: ShopInfoSearchParams) => void;
}

const ShopInfoFilter: React.FC<ShopInfoFilterProps> = ({
    lang,
    isLoading = false,
    onSearch,
}) => {
    const [shopName, setShopName] = useState('');
    const [shopStatus, setShopStatus] = useState('');

    const statusOptions = getShopStatusFilterOptions(lang);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            shopName: shopName.trim(),
            shopStatus,
        });
    };

    return (
        <Form
            className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-3 mb-4 border-b border-gray-200"
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_shop_info_shop_name']}
                </Form.Label>
                <Form.Control
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={lang['page_shop_info_shop_name']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['global_status']}
                </Form.Label>
                <SearchableDropdown
                    items={statusOptions.map((item) => ({
                        label: item.label,
                        value: item.value,
                    }))}
                    value={shopStatus}
                    onChange={setShopStatus}
                    placeholder={lang['global_all']}
                    searchPlaceholder={lang['global_search']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group className="flex items-end">
                <Button
                    variant="primary"
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isLoading}
                >
                    <i className="fa-solid fa-search mr-2"></i>
                    {lang['global_search']}
                </Button>
            </Form.Group>
        </Form>
    );
};

export default ShopInfoFilter;
