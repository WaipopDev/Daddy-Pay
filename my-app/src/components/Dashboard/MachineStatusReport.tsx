import React, { useEffect, useState } from 'react';
import FilterDashboard from '../Filter/FilterDashboard';
import { SearchParams } from '@/hooks/useReportData';
import { useDashboardMachineStatus } from '@/hooks/useDashboardData';
import MachineStatusBoxes from './MachineStatus';

const MachineStatusReport = ({ lang }: { lang: { [key: string]: string } }) => {
    const { machineStatus, fetchMachineStatus } = useDashboardMachineStatus();
    const [valueShop, setValueShop] = useState('');

    useEffect(() => {
        if (!valueShop) {
            return;
        }

        void fetchMachineStatus(valueShop);
        const intervalId = window.setInterval(() => {
            void fetchMachineStatus(valueShop);
        }, 30_000);

        return () => window.clearInterval(intervalId);
    }, [fetchMachineStatus, valueShop]);

    const fetchData = async (search: SearchParams) => {
        if (!search.branchId) {
            return;
        }
        setValueShop(search.branchId);
    };

    return (
        <div className="bg-white py-3 border-t-2 border-gray-200">
            <FilterDashboard fetchData={fetchData} />
            <MachineStatusBoxes machineStatus={machineStatus} lang={lang} />
        </div>
    );
};

export default MachineStatusReport;
