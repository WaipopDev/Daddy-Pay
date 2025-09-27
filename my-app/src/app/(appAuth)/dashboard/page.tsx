'use client';
import React from 'react'
import { Tab, Tabs } from 'react-bootstrap';
import { useAppSelector } from '@/store/hook';
import { SalesReport, GraphReport } from '@/components/Dashboard';

const DashboardPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
   
    return (
        <main className="bg-white p-2">
            <Tabs
                className="mb-3"
                defaultActiveKey="sales_report"
            >
                <Tab
                    eventKey="sales_report"
                    title={lang['page_dashboard_sales_report']}
                >
                    <SalesReport />
                    <GraphReport lang={lang} />
                </Tab>
            </Tabs>
        </main>
    )
}

export default DashboardPage