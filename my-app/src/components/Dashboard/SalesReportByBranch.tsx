import React from 'react'
import { formatNumber } from '@/utils/main';

interface SalesReportByBranchProps {
    branchTotalSale: {
        totalSaleByDay: number;
        totalSaleByWeek: number;
        totalSaleByMonth: number;
    } | null;
    branchTotalMachine: {
        totalActiveMachine: number;
        totalInactiveMachine: number;
        totalMachine: number;
    } | null;
    lang: { [key: string]: string };
}

const SalesReportByBranch = ({ branchTotalMachine, branchTotalSale, lang }: SalesReportByBranchProps) => {

    if(!branchTotalMachine || !branchTotalSale) return null;
    return (
        <div className="mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 text-white">
                <div className="px-3 py-3 md:px-4 md:py-2 rounded-md border border-gray-300 flex bg-[#01A0B6]">
                    <div className="flex-1">
                        <p className="mb-0 text-xs md:text-sm">{lang['page_dashboard_sales_report_total_sales_by_day']}</p>
                        <h2 className="font-bold text-sm md:text-base">{formatNumber(branchTotalSale.totalSaleByDay)}</h2>
                    </div>
                    <div className="ml-2 md:ml-3 rounded-full bg-white p-1.5 md:p-2 w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-hand-holding-dollar text-[16px] md:text-[20px] text-[#01A0B6]"></i>
                    </div>
                </div>
                <div className="px-3 py-3 md:px-4 md:py-2 rounded-md border-gray-300 flex bg-[#01A0B6]">
                    <div className="flex-1">
                        <p className="mb-0 text-xs md:text-sm">{lang['page_dashboard_sales_report_total_sales_by_week']}</p>
                        <h2 className="font-bold text-sm md:text-base">{formatNumber(branchTotalSale.totalSaleByWeek)}</h2>
                    </div>
                    <div className="ml-2 md:ml-3 rounded-full bg-white p-1.5 md:p-2 w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-hand-holding-dollar text-[16px] md:text-[25px] text-[#01A0B6]"></i>
                    </div>
                </div>
                <div className="px-3 py-3 md:px-4 md:py-2 rounded-md border-gray-300 flex bg-[#01A0B6]">
                    <div className="flex-1">
                        <p className="mb-0 text-xs md:text-sm">{lang['page_dashboard_sales_report_total_sales_by_month']}</p>
                        <h2 className="font-bold text-sm md:text-base">{formatNumber(branchTotalSale.totalSaleByMonth)}</h2>
                    </div>
                    <div className="ml-2 md:ml-3 rounded-full bg-white p-1.5 md:p-2 w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-hand-holding-dollar text-[16px] md:text-[25px] text-[#01A0B6]"></i>
                    </div>
                </div>
                <div className="px-3 py-3 md:px-4 md:py-2 rounded-md border-gray-300 flex bg-[#3CB29D]">
                    <div className="flex-1">
                        <p className="mb-0 text-xs md:text-sm">{lang['page_dashboard_sales_report_available_machine']}</p>
                        <h2 className="font-bold text-sm md:text-base">{`${formatNumber(branchTotalMachine.totalActiveMachine)} / ${formatNumber(branchTotalMachine.totalMachine)}`}</h2>
                    </div>
                    <div className="ml-2 md:ml-3 rounded-full bg-white p-1.5 md:p-2 w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-gear text-[16px] md:text-[25px] text-[#3CB29D]"></i>
                    </div>
                </div>
                <div className="px-3 py-3 md:px-4 md:py-2 rounded-md border-gray-300 flex bg-[#E56979]">
                    <div className="flex-1">
                        <p className="mb-0 text-xs md:text-sm">{lang['page_dashboard_sales_report_under_maintenance_machine']}</p>
                        <h2 className="font-bold text-sm md:text-base">{`${formatNumber(branchTotalMachine.totalInactiveMachine)} / ${formatNumber(branchTotalMachine.totalMachine)}`}</h2>
                    </div>
                    <div className="ml-2 md:ml-3 rounded-full bg-white p-1.5 md:p-2 w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-gear text-[16px] md:text-[25px] text-[#E56979]"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesReportByBranch