'use client';

import React from 'react';
import { ShopManagementTransactionView } from '@/components/ShopManagementTransaction';
import { useShopManagementTransactionViewModel } from '@/hooks/useShopManagementTransactionViewModel';

const ShopManagementTransactionPage = () => {
    const vm = useShopManagementTransactionViewModel();
    return <ShopManagementTransactionView vm={vm} />;
};

export default ShopManagementTransactionPage;
