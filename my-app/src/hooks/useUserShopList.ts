import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useAppSelector } from '@/store/hook';
import { USER_API_ENDPOINTS } from '@/constants/user';
import { SHOP_INFO_API_ENDPOINTS } from '@/constants/shopInfo';

export interface UserShopListItem {
    id: string;
    shopName: string;
}

export const useUserShopList = () => {
    const userRole = useAppSelector((state) => state.user.role);
    const [shops, setShops] = useState<UserShopListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShops = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint =
                userRole === 'super-admin'
                    ? SHOP_INFO_API_ENDPOINTS.LIST
                    : USER_API_ENDPOINTS.SHOP_LIST;

            const response = await axios.get<UserShopListItem[]>(endpoint);
            if (response.status === 200) {
                const ordered = _.orderBy(response.data, ['shopName'], ['asc']).map(
                    (shop: { id?: string | number; shopId?: string | number; shopName: string }) => ({
                        id: String(shop.shopId ?? shop.id ?? ''),
                        shopName: shop.shopName,
                    })
                );
                setShops(ordered);
            }
        } catch (err) {
            console.error('Error fetching shop list:', err);
            setError('Failed to fetch shop list');
            setShops([]);
        } finally {
            setIsLoading(false);
        }
    }, [userRole]);

    useEffect(() => {
        if (userRole) {
            fetchShops();
        }
    }, [userRole, fetchShops]);

    return {
        shops,
        isLoading,
        error,
        refetch: fetchShops,
    };
};
