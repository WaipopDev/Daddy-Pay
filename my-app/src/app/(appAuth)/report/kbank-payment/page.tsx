'use client';
import React, { Suspense } from 'react'
import { useAppSelector } from '@/store/hook';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import FilterReportBank from '@/components/Filter/FilterReportBank';
import ErrorBoundary from '@/components/ErrorBoundary';
import TableComponent from '@/components/Table/Table';
import moment from 'moment';
import { PAYMENT_METHOD } from '@/constants/main';
import { useReportDataBank } from '@/hooks';

const KbankPaymentPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const router = useRouter();
    const { items, page, fetchData, summary } = useReportDataBank();

    const handleBack = () => {
        router.back();
    }
    return (
        <div className="bg-white p-2 md:p-4">
            <Button variant="secondary" onClick={handleBack} className="mb-3 w-full md:w-auto">
                <i className="fa-solid fa-arrow-left pr-2"></i>
                {lang['button_back']}
            </Button>

            <FilterReportBank reportName="kbank-payment" fetchData={fetchData} />
            <div className="pb-2 mb-4">
                <p className="font-bold text-lg md:text-xl">{lang['page_report_branch_income']}</p>
                <p className="text-sm md:text-base">{lang['page_report_branch_income_total_income']} : {summary || 0} {lang['global_baht']}</p>
            </div>

            <ErrorBoundary>
                <Suspense fallback={<p>Loading feed...</p>}>
                    <TableComponent
                        head={['#',
                            lang['page_report_branch_income_transaction_date'],
                            lang['page_report_branch_income_transaction_id'],
                            lang['page_report_bank_payment_ref_1'],
                            lang['page_report_bank_payment_ref_2'],
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
                        activePage={false}
                    >
                        {items && items.length > 0 && items.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-xs md:text-sm">{moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                <td className="text-xs md:text-sm">{item.txnNo}</td>
                                <td className="text-xs md:text-sm">{item.reference1}</td>
                                <td className="text-xs md:text-sm">{item.reference2}</td>
                                <td className="text-xs md:text-sm">{item.shopName}</td>
                                <td className="text-xs md:text-sm">{item.machineType}</td>
                                <td className="text-xs md:text-sm">{item.shopManagementName}</td>
                                <td className="text-xs md:text-sm">{item.programName}</td>
                                <td className="text-xs md:text-sm">{PAYMENT_METHOD.find(i => i.id === 'prompt_pay')?.name || '-'}</td>
                                <td className="text-xs md:text-sm text-right">{item.txnAmount}</td>
                            </tr>
                        ))}
                    </TableComponent>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}

export default KbankPaymentPage