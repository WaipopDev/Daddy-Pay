import React, { useEffect, useState } from 'react'
import FilterDashboard from '../Filter/FilterDashboard'
import { SearchParams } from '@/hooks/useReportData'
import { useDashboardGraphData } from '@/hooks/useDashboardData'
import GraphDataByBarChart from './GraphDataByBarChart'
import SalesReportByBranch from './SalesReportByBranch'

const GraphReport = ({ lang }: { lang: { [key: string]: string } }) => {
    const { graphData, fetchGraphData } = useDashboardGraphData();
    const [valueShop, setValueShop] = useState('');
    useEffect(() => {
        if (valueShop) {
            fetchGraphData(valueShop);
        }

    }, [fetchGraphData, valueShop]);

    const fetchData = async (search: SearchParams) => {
        if (!search.branchId) {
            return;
        }
        setValueShop(search.branchId);
    }
    
    return (
        <div className='bg-white py-3 border-t-2 border-gray-200'>
            <FilterDashboard fetchData={fetchData} />
            <div>
                <SalesReportByBranch branchTotalMachine={graphData.branchTotalMachine} branchTotalSale={graphData.branchTotalSale} lang={lang} />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-3'>
                <div className='w-full'>
                    {
                        graphData.graphDataByDay && (
                            <GraphDataByBarChart graphData={graphData.graphDataByDay} labelText={lang['page_dashboard_sales_report_graph_by_day']} />
                        )
                    }
                </div>
                <div className='w-full'>
                    {
                        graphData.graphDataByWeek && (
                            <GraphDataByBarChart graphData={graphData.graphDataByWeek} labelText={lang['page_dashboard_sales_report_graph_by_week']} />
                        )
                    }
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-3'>
                <div className='w-full'>
                    {
                        graphData.graphDataByMonth && (
                            <GraphDataByBarChart graphData={graphData.graphDataByMonth} labelText={lang['page_dashboard_sales_report_graph_by_month']} />
                        )
                    }
                </div>
                <div className='w-full'>
                    {
                        graphData.graphDataByYear && (
                            <GraphDataByBarChart graphData={graphData.graphDataByYear} labelText={lang['page_dashboard_sales_report_graph_by_year']} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default GraphReport