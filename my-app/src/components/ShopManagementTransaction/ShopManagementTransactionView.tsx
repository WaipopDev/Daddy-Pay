'use client';

import React from 'react';
import ShopManagementTransactionHeader from './ShopManagementTransactionHeader';
import ShopManagementTransactionFilter from './ShopManagementTransactionFilter';
import ShopManagementTransactionTable from './ShopManagementTransactionTable';
import type { useShopManagementTransactionViewModel } from '@/hooks/useShopManagementTransactionViewModel';

type ViewModel = ReturnType<typeof useShopManagementTransactionViewModel>;

interface ShopManagementTransactionViewProps {
    vm: ViewModel;
}

const ShopManagementTransactionView: React.FC<ShopManagementTransactionViewProps> = ({ vm }) => {
    const { lang, shopManagementId } = vm;

    if (!shopManagementId) {
        return null;
    }

    const tableLabels = {
        loading: lang['global_loading'],
        noData: lang['global_no_data'],
        columns: [
            '#',
            lang['page_report_branch_income_transaction_date'],
            lang['page_machine_info_brand'],
            lang['page_report_branch_income_program_name'],
            lang['page_report_branch_income_price'],
            lang['page_report_branch_income_price_type'],
            lang['page_report_branch_income_machine_type'],
        ],
    };

    return (
        <main className="bg-white p-2 md:p-4">
            <ShopManagementTransactionHeader
                backLabel={lang['button_back']}
                titleLabel={lang['page_shop_management_transaction_title']}
                machineNameLabel={lang['page_shop_management_machine_name']}
                machineName={vm.machineName}
                onBack={vm.handleBack}
            />

            <ShopManagementTransactionFilter
                dateLabel={lang['filter_report_select_date']}
                searchLabel={lang['global_search']}
                dateRange={vm.dateRange}
                isLoading={vm.isLoading}
                onDateChange={vm.handleDateRangeChange}
                onSearch={vm.handleSearch}
            />

            <ShopManagementTransactionTable
                items={vm.items}
                page={vm.page.page}
                totalPages={vm.page.totalPages}
                isLoading={vm.isLoading}
                labels={tableLabels}
                onPageChange={vm.handlePageChange}
            />
        </main>
    );
};

export default ShopManagementTransactionView;
