'use client';
import React, { Suspense } from 'react'
import { useAppSelector } from '@/store/hook';
import { useReportData } from '@/hooks/useReportData';
import TableComponent from '@/components/Table/Table';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import FilterReport from '@/components/Filter/FilterReport';
import { PAYMENT_METHOD } from '@/constants/main';
import moment from 'moment';

const BranchIncomePage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const router = useRouter();
    const { items, page, fetchData, summary } = useReportData();

    const handleBack = () => {
        router.back();
    }
    return (
        <div className="bg-white p-2">
            <Button variant="secondary" onClick={handleBack} className="mb-3">
                <i className="fa-solid fa-arrow-left pr-2"></i>
                {lang['button_back']}
            </Button>

            <FilterReport reportName="branch-income" fetchData={fetchData} />
            <div className="pb-2">
                <p className="font-bold">{lang['page_report_branch_income']}</p>
                <p>{lang['page_report_branch_income_total_income']} : {summary || 0} {lang['global_baht']}</p>
            </div>

            <ErrorBoundary>
                <Suspense fallback={<p>Loading feed...</p>}>
                    <TableComponent
                        head={['#', 
                            lang['page_report_branch_income_transaction_date'], 
                            lang['page_report_branch_income_transaction_id'],
                            lang['page_report_branch_income_transaction_iot'],
                            lang['page_report_branch_income_shop_name'],
                            lang['page_report_branch_income_machine_type'],
                            lang['page_report_branch_income_machine_name'],
                            lang['page_report_branch_income_program_name'],
                            lang['page_report_branch_income_price_type'],
                            lang['page_report_branch_income_price']
                        ]}
                        page={page.page}
                        totalPages={page.totalPages}
                        handleActive={(number: number) => fetchData(number)}
                    >
                        {items && items.length > 0 && items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                <td>{item.transactionId}</td>
                                <td>{item.transactionIot}</td>
                                <td>{item.shopInfo.shopName}</td>
                                <td>{item.machineInfo.machineType}</td>
                                <td>{item.shopManagement.shopManagementName}</td>
                                <td>{item.programInfo.programName}</td>
                                <td>{PAYMENT_METHOD.find(i => i.id === item.priceType)?.name || '-'}</td>
                                <td>{item.price}</td>
                                
                                
                                
                            </tr>
                        ))}
                    </TableComponent>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}

export default BranchIncomePage