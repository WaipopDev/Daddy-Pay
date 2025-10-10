'use client';
import React from 'react'
import { Tab, Tabs } from 'react-bootstrap';
import { useAppSelector } from '@/store/hook';
import { SalesReport, GraphReport } from '@/components/Dashboard';

const DashboardPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
   
    return (
        <main className="bg-white p-2 md:p-4">
            <Tabs
                className="mb-3"
                defaultActiveKey="sales_report"
            >
                <Tab
                    eventKey="sales_report"
                    title={lang['page_dashboard_sales_report']}
                >
                    <div className="space-y-4 md:space-y-6">
                        <SalesReport />
                        <GraphReport lang={lang} />
                    </div>
                </Tab>
            </Tabs>
        </main>
    )
}

export default DashboardPage