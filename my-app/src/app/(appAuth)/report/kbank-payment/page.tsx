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
        <div className="bg-white p-2">
            <Button variant="secondary" onClick={handleBack} className="mb-3">
                <i className="fa-solid fa-arrow-left pr-2"></i>
                {lang['button_back']}
            </Button>

            <FilterReportBank reportName="kbank-payment" fetchData={fetchData} />
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
                                <td>{index + 1}</td>
                                <td>{moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                <td>{item.txnNo}</td>
                                <td>{item.reference1}</td>
                                <td>{item.reference2}</td>
                                <td>{item.shopName}</td>
                                <td>{item.machineType}</td>
                                <td>{item.shopManagementName}</td>
                                <td>{item.programName}</td>
                                <td>{PAYMENT_METHOD.find(i => i.id === 'prompt_pay')?.name || '-'}</td>
                                <td>{item.txnAmount}</td>



                            </tr>
                        ))}
                    </TableComponent>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}

export default KbankPaymentPage