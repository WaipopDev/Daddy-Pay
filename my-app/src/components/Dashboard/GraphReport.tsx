import React, { useEffect, useState } from 'react'
import FilterDashboard from '../Filter/FilterDashboard'
import { SearchParams } from '@/hooks/useReportData'
import { useDashboardGraphData } from '@/hooks/useDashboardData'
import GraphDataByBarChart from './GraphDataByBarChart'

const GraphReport = ({lang}: {lang: { [key: string]: string }}) => {
    const { graphData, fetchGraphData } = useDashboardGraphData();
    console.log('graphData', graphData)
    const [valueShop, setValueShop] = useState('');
    useEffect(() => {
        if(valueShop){
            fetchGraphData(valueShop);
        }
        
    }, [fetchGraphData, valueShop]);

    const fetchData = (search: SearchParams) => {
        if(!search.branchId){
            return;
        }
        setValueShop(search.branchId);
    }
  return (
    <div className='bg-white py-3'>
        <FilterDashboard fetchData={fetchData} />
        <div className='flex gap-2 mb-3'>
            <div className='basis-1/2'>
              {
                  graphData.graphDataByDay  && (
                      <GraphDataByBarChart graphData={graphData.graphDataByDay} labelText={lang['page_dashboard_sales_report_graph_by_day']} />
                  )
              }
            </div>
            <div className='basis-1/2'>
              {
                  graphData.graphDataByWeek  && (
                      <GraphDataByBarChart graphData={graphData.graphDataByWeek} labelText={lang['page_dashboard_sales_report_graph_by_week']} />
                  )
              }
            </div>
        </div>
        <div className='flex gap-2 mb-3'>
            <div className='basis-1/2'>
              {
                  graphData.graphDataByMonth  && (
                      <GraphDataByBarChart graphData={graphData.graphDataByMonth} labelText={lang['page_dashboard_sales_report_graph_by_month']} />
                  )
              }
            </div>
            <div className='basis-1/2'>
              {
                  graphData.graphDataByYear  && (
                      <GraphDataByBarChart graphData={graphData.graphDataByYear} labelText={lang['page_dashboard_sales_report_graph_by_year']} />
                  )
              }
            </div>
        </div>
    </div>
  )
}

export default GraphReport