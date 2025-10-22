'use client';
import React, { Suspense, useState } from 'react'
import { useAppSelector } from '@/store/hook';
import { SearchParams, useReportData } from '@/hooks/useReportData';
import TableComponent from '@/components/Table/Table';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import FilterReport from '@/components/Filter/FilterReport';
import { PAYMENT_METHOD } from '@/constants/main';
import moment from 'moment';
import { noIndex } from '@/utils/main';

const BranchIncomePage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const router = useRouter();
    const { items, page, fetchData, summary } = useReportData();
    const [search, setSearch] = useState<SearchParams>({
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
    });

    const handleBack = () => {
        router.back();
    }
    const handleFetchData = async (pageNumber: number, search: SearchParams) => {
        setSearch(search);
        await fetchData(pageNumber, search);
    }
    const handleFetchPageData = (pageNumber: number) => {
        fetchData(pageNumber, search);
    }
    return (
        <div className="bg-white p-2 md:p-4">
            <Button variant="secondary" onClick={handleBack} className="mb-3 w-full md:w-auto">
                <i className="fa-solid fa-arrow-left pr-2"></i>
                {lang['button_back']}
            </Button>

            <FilterReport reportName="branch-income" fetchData={handleFetchData} />
            <div className="pb-2 mb-4">
                <p className="font-bold text-lg md:text-xl">{lang['page_report_branch_income']}</p>
                <p className="text-sm md:text-base">{lang['page_report_branch_income_total_income']} : {summary || 0} {lang['global_baht']}</p>
            </div>

            <ErrorBoundary>
                <Suspense fallback={<p>Loading feed...</p>}>
                    <TableComponent
                        head={['#', 
                            lang['page_report_branch_income_transaction_date'], 
                            lang['page_report_branch_income_transaction_iot'],
                            lang['page_report_branch_income_transaction_bank_ref'],
                            lang['page_report_branch_income_shop_name'],
                            lang['page_report_branch_income_machine_type'],
                            lang['page_report_branch_income_machine_name'],
                            lang['page_report_branch_income_program_name'],
                            lang['page_report_branch_income_price_type'],
                            lang['page_report_branch_income_price']
                        ]}
                        page={page.page}
                        totalPages={page.totalPages}
                        handleActive={(number: number) => handleFetchPageData(number)}
                    >
                        {items && items.length > 0 && items.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">{noIndex(page.page, index, 50)}</td>
                                <td className="text-xs md:text-sm">{moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                <td className="text-xs md:text-sm">{item.transactionIot}</td>
                                <td className="text-xs md:text-sm">{item.transactionId}</td>
                                <td className="text-xs md:text-sm">{item.shopInfo.shopName}</td>
                                <td className="text-xs md:text-sm">{item.machineInfo.machineType}</td>
                                <td className="text-xs md:text-sm">{item.shopManagement.shopManagementName}</td>
                                <td className="text-xs md:text-sm">{item.programInfo.programName}</td>
                                <td className="text-xs md:text-sm">{PAYMENT_METHOD.find(i => i.id === item.priceType)?.name || '-'}</td>
                                <td className="text-xs md:text-sm text-right">{item.price}</td>
                            </tr>
                        ))}
                    </TableComponent>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}

export default BranchIncomePage