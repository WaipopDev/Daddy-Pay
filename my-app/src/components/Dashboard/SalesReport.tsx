import React from 'react'
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAppSelector } from '@/store/hook';
import { formatNumber } from '@/utils/main';

const SalesReport = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    
    const { totalSales, totalMachine } = useDashboardData();
    return (
        <div>
            <div className="flex justify-between text-white">
                <div className="px-4 py-2 rounded-md border border-gray-300 flex bg-[#01A0B6]">
                    <div>
                        <p className="mb-0 text-sm">{lang['page_dashboard_sales_report_total_sales_by_day']}</p>
                        <h2 className="font-bold">{formatNumber(totalSales.totalSaleByDay)}</h2>
                    </div>
                    <div className="ml-3 rounded-full bg-white p-2 w-[40px] h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-hand-holding-dollar text-[20px] text-[#01A0B6]"></i>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-md border-gray-300 flex bg-[#01A0B6]">
                    <div>
                        <p className="mb-0 text-sm">{lang['page_dashboard_sales_report_total_sales_by_week']}</p>
                        <h2 className="font-bold">{formatNumber(totalSales.totalSaleByWeek)}</h2>
                    </div>
                    <div className="ml-3 rounded-full bg-white p-2 w-[40px] h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-hand-holding-dollar text-[25px] text-[#01A0B6]"></i>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-md border-gray-300 flex bg-[#01A0B6]">
                    <div>
                        <p className="mb-0 text-sm">{lang['page_dashboard_sales_report_total_sales_by_month']}</p>
                        <h2 className="font-bold">{formatNumber(totalSales.totalSaleByMonth)}</h2>
                    </div>
                    <div className="ml-3 rounded-full bg-white p-2 w-[40px] h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-hand-holding-dollar text-[25px] text-[#01A0B6]"></i>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-md border-gray-300 flex bg-[#3CB29D]">
                    <div>
                        <p className="mb-0 text-sm">{lang['page_dashboard_sales_report_available_machine']}</p>
                        <h2 className="font-bold">{`${formatNumber(totalMachine.totalActiveMachine)} / ${formatNumber(totalMachine.totalMachine)}`}</h2>
                    </div>
                    <div className="ml-3 rounded-full bg-white p-2 w-[40px] h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-gear text-[25px] text-[#3CB29D]"></i>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-md border-gray-300 flex bg-[#E56979]">
                    <div>
                        <p className="mb-0 text-sm">{lang['page_dashboard_sales_report_under_maintenance_machine']}</p>
                        <h2 className="font-bold">{`${formatNumber(totalMachine.totalInactiveMachine)} / ${formatNumber(totalMachine.totalMachine)}`}</h2>
                    </div>
                    <div className="ml-3 rounded-full bg-white p-2 w-[40px] h-[40px] flex items-center justify-center">
                        <i className="fa-solid fa-gear text-[25px] text-[#E56979]"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesReport