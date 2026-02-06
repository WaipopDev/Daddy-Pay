'use client';
import React, { Suspense, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { SearchParams, useReportData } from '@/hooks/useReportData';
import TableComponent from '@/components/Table/Table';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import FilterReport from '@/components/Filter/FilterReport';
import { PAYMENT_METHOD } from '@/constants/main';
import moment from 'moment';
import { formatNumber, noIndex } from '@/utils/main';
import * as XLSX from 'xlsx';
import { setProcess } from '@/store/features/modalSlice';

const BranchIncomePage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { items, page, fetchData, summary, fetchDataExcel } = useReportData();

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
    const handleFetchPageData = (pageNumber: number) => {
        fetchData(pageNumber, search);
    }

    const exportToExcel = async () => {
        dispatch(setProcess(true));
        setIsExporting(true);
        const excelDataArray = [];
        for(let i = 1; i <= page.totalPages; i++) {
            const data = await fetchDataExcel(i, search);
            if (data) {
                excelDataArray.push(...data);
            }
        }
        const excelData = excelDataArray.map((item, index) => ({
            '#': index + 1,
            'วันที่ทำรายการ': moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss'),
            'Transaction IoT': item.transactionIot,
            'Transaction Bank Ref': item.transactionId,
            'ชื่อร้าน': item.shopInfo.shopName,
            'ประเภทเครื่อง': item.machineInfo.machineType,
            'ชื่อเครื่อง': item.shopManagement.shopManagementName,
            'ชื่อโปรแกรม': item.programInfo.programName,
            'ประเภทราคา': PAYMENT_METHOD.find(i => i.id === item.priceType)?.name || '-',
            'ราคา': item.price
        }));
  
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const colWidths = [
            { wch: 5 },   // #
            { wch: 20 },  // วันที่ทำรายการ
            { wch: 15 },  // Transaction IoT
            { wch: 20 },  // Transaction Bank Ref
            { wch: 25 },  // ชื่อร้าน
            { wch: 15 },  // ประเภทเครื่อง
            { wch: 20 },  // ชื่อเครื่อง
            { wch: 20 },  // ชื่อโปรแกรม
            { wch: 15 },  // ประเภทราคา
            { wch: 15 }   // ราคา
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

            <FilterReport reportName="branch-income" fetchData={handleFetchData} />
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
                            <tr
                                key={index}
                                className={[
                                    // Bootstrap sets background on td/th via `.table > :not(caption) > * > *`
                                    // so we apply row colors to cells to ensure it shows.
                                    'hover:[&>td]:bg-gray-100',
                                    item.shopManagement?.deletedAt ? '[&>td]:!bg-red-500' : '',
                                ].join(' ')}
                            >
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