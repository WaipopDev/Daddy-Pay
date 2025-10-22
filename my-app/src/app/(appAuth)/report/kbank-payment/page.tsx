'use client';
import React, { Suspense, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import FilterReportBank from '@/components/Filter/FilterReportBank';
import ErrorBoundary from '@/components/ErrorBoundary';
import TableComponent from '@/components/Table/Table';
import moment from 'moment';
import { PAYMENT_METHOD } from '@/constants/main';
import { useReportDataBank } from '@/hooks';
import { formatNumber } from '@/utils/main';
import { setProcess } from '@/store/features/modalSlice';
import * as XLSX from 'xlsx';
import { SearchParams } from '@/hooks/useReportData';

const KbankPaymentPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { items, page, fetchData, summary, fetchDataExcel } = useReportDataBank();
    const [search, setSearch] = useState<SearchParams>({
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
    });
    const [isExporting, setIsExporting] = useState(false);
    const handleBack = () => {
        router.back();
    }
    const handleFetchData = async (pageNumber: number, search: SearchParams) => {
        setSearch(search);
        await fetchData(pageNumber, search);
    }
    const exportToExcel = async () => {
        dispatch(setProcess(true));
        setIsExporting(true);
        const excelDataArray = await fetchDataExcel(1, search);
        const excelData = excelDataArray && excelDataArray.length > 0 ? excelDataArray.map((item, index) => ({
            '#': index + 1,
            [lang['page_report_branch_income_transaction_date']]: moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss'),
            [lang['page_report_branch_income_transaction_id']]: item.txnNo,
            [lang['page_report_bank_payment_ref_1']]: item.reference1,
            [lang['page_report_bank_payment_ref_2']]: item.reference2,
            [lang['page_report_branch_income_shop_name']]: item.shopName,
            [lang['page_report_branch_income_machine_type']]: item.machineType,
            [lang['page_report_branch_income_machine_name']]: item.shopManagementName,
            [lang['page_report_branch_income_program_name']]: item.programName,
            [lang['page_report_branch_income_price_type']]: PAYMENT_METHOD.find(i => i.id === 'prompt_pay')?.name || '-',
            [lang['page_report_branch_income_price']]: item.txnAmount
        })) : [];
  
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const colWidths = [
            { wch: 5 },   // #
            { wch: 20 },
            { wch: 15 },
            { wch: 20 },
            { wch: 25 },
            { wch: 15 },
            { wch: 20 }, 
            { wch: 20 }, 
            { wch: 15 }, 
            { wch: 15 },  
            { wch: 15 }  
        ];
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Branch Income Report');

        // Generate filename with current date
        const currentDate = moment().format('YYYY-MM-DD');
        const filename = `Branch_Income_Report_${currentDate}.xlsx`;

        // Save file
        XLSX.writeFile(wb, filename);
        dispatch(setProcess(false));
        setIsExporting(false);
    }
    return (
        <div className="bg-white p-2 md:p-4">
            <Button variant="secondary" onClick={handleBack} className="mb-3 w-full md:w-auto">
                <i className="fa-solid fa-arrow-left pr-2"></i>
                {lang['button_back']}
            </Button>

            <FilterReportBank reportName="kbank-payment" fetchData={handleFetchData} />
            <div className="mb-3 flex justify-end">
                <Button 
                    variant="success" 
                    onClick={exportToExcel}
                    className="w-full md:w-auto"
                    disabled={isExporting}
                >
                    <i className="fa-solid fa-file-excel pr-2"></i>
                    Export Excel
                </Button>
            </div>
            <div className="pb-2 mb-4">
                <p className="font-bold text-lg md:text-xl">{lang['page_report_branch_income']}</p>
                <p className="text-sm md:text-base">{lang['page_report_branch_income_total_income']} : {formatNumber(summary && Number(summary) || 0)} {lang['global_baht']}</p>
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