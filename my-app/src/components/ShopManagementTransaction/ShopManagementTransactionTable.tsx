'use client';

import React, { Suspense } from 'react';
import moment from 'moment';
import TableComponent from '@/components/Table/Table';
import { PAYMENT_METHOD, PAGINATION_CONFIG } from '@/constants/main';
import type { ShopManagementTransactionItem } from '@/types/shopManagementTransactionType';
import { formatNumber, noIndex } from '@/utils/main';

export interface ShopManagementTransactionTableLabels {
    loading: string;
    noData: string;
    columns: string[];
}

const getBrandName = (item: ShopManagementTransactionItem) =>
    item.machineInfo?.machineBrand || '-';

interface ShopManagementTransactionTableProps {
    items: ShopManagementTransactionItem[];
    page: number;
    totalPages: number;
    isLoading: boolean;
    labels: ShopManagementTransactionTableLabels;
    onPageChange: (pageNumber: number) => void;
}

const getPriceTypeLabel = (priceType: string) =>
    PAYMENT_METHOD.find((m) => m.id === priceType)?.name || priceType;

const ShopManagementTransactionTable: React.FC<ShopManagementTransactionTableProps> = ({
    items,
    page,
    totalPages,
    isLoading,
    labels,
    onPageChange,
}) => (
    <Suspense fallback={<p>{labels.loading}</p>}>
        <TableComponent
            head={labels.columns}
            page={page}
            totalPages={totalPages}
            handleActive={onPageChange}
        >
            {items.length > 0 ? (
                items.map((item, index) => (
                    <tr key={item.id}>
                        <td className="text-center">
                            {noIndex(page, index, PAGINATION_CONFIG.ITEMS_PER_PAGE)}
                        </td>
                        <td className="text-xs md:text-sm">
                            {moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                        </td>
                        <td className="text-xs md:text-sm">{getBrandName(item)}</td>
                        <td className="text-xs md:text-sm">
                            {item.programInfo?.programName || '-'}
                        </td>
                        <td className="text-xs md:text-sm text-right">
                            {formatNumber(Number(item.price))}
                        </td>
                        <td className="text-xs md:text-sm">
                            {getPriceTypeLabel(item.priceType)}
                        </td>
                        <td className="text-xs md:text-sm">
                            {item.machineInfo?.machineType || '-'}
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={7} className="text-center text-xs md:text-sm">
                        {isLoading ? labels.loading : labels.noData}
                    </td>
                </tr>
            )}
        </TableComponent>
    </Suspense>
);

export default ShopManagementTransactionTable;
