import React from 'react';
import TableComponent from '@/components/Table/Table';
import { PAYMENT_METHOD } from '@/constants/main';
import type { MachineStatusLatestBranchIncomeTransaction } from '@/types/dashboardType';
import moment from 'moment';

interface MachineStatusLatestBranchIncomeTableProps {
    transactions: MachineStatusLatestBranchIncomeTransaction[];
    lang: { [key: string]: string };
}

const MachineStatusLatestBranchIncomeTable = ({
    transactions,
    lang,
}: MachineStatusLatestBranchIncomeTableProps) => (
    <div className="mt-4">
        <p className="font-bold text-lg md:text-xl mb-2">
            {lang['page_dashboard_machine_status_latest_branch_income']}
        </p>
        <TableComponent
            head={[
                '#',
                lang['page_report_branch_income_transaction_date'],
                lang['page_report_branch_income_transaction_iot'],
                lang['page_report_branch_income_transaction_bank_ref'],
                lang['page_report_branch_income_shop_name'],
                lang['page_report_branch_income_machine_type'],
                lang['page_report_branch_income_machine_name'],
                lang['page_report_branch_income_program_name'],
                lang['page_report_branch_income_price_type'],
                lang['page_report_branch_income_price'],
            ]}
            page={1}
            totalPages={1}
            handleActive={() => undefined}
            activePage={false}
        >
            {transactions.length > 0 &&
                transactions.map((item, index) => (
                    <tr key={item.id || index} className="hover:[&>td]:bg-gray-100">
                        <td className="text-center">{index + 1}</td>
                        <td className="text-xs md:text-sm">
                            {moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                        </td>
                        <td className="text-xs md:text-sm">{item.transactionIot || '-'}</td>
                        <td className="text-xs md:text-sm">{item.transactionId || '-'}</td>
                        <td className="text-xs md:text-sm">{item.shopInfo.shopName}</td>
                        <td className="text-xs md:text-sm">{item.machineInfo.machineType}</td>
                        <td className="text-xs md:text-sm">
                            {item.shopManagement.shopManagementName}
                        </td>
                        <td className="text-xs md:text-sm">{item.programInfo.programName}</td>
                        <td className="text-xs md:text-sm">
                            {PAYMENT_METHOD.find((i) => i.id === item.priceType)?.name || '-'}
                        </td>
                        <td className="text-xs md:text-sm text-right">{item.price}</td>
                    </tr>
                ))}
        </TableComponent>
    </div>
);

export default MachineStatusLatestBranchIncomeTable;
