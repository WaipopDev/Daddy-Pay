import { useCallback, useEffect, useState } from "react";
import { DASHBOARD_API_ENDPOINTS } from "@/constants/dashboard";
import type {
    MachineStatusApiResponse,
    MachineStatusData,
    MachineStatusItem,
} from "@/types/dashboardType";
import axios from "axios";

const EMPTY_MACHINE_STATUS: MachineStatusData = {
    summary: {
        totalMachine: 0,
        totalOnlineActive: 0,
        totalOnlineInactive: 0,
        totalOperationalActive: 0,
        totalOperationalStandby: 0,
    },
    availableItems: [],
    operatingItems: [],
    disconnectedItems: [],
};

const groupMachineStatusItems = (items: MachineStatusItem[]) => ({
    availableItems: items.filter((item) => item.status === 'standby'),
    operatingItems: items.filter((item) => item.status === 'active'),
    disconnectedItems: items.filter(
        (item) => item.status !== 'standby' && item.status !== 'active'
    ),
});

export const useDashboardData = () => {
    const [totalSales, setTotalSales] = useState({
        totalSaleByDay:0,
        totalSaleByWeek:0,
        totalSaleByMonth:0,
    });
    const [totalMachine, setTotalMachine] = useState({
        totalActiveMachine:0,
        totalInactiveMachine:0,
        totalMachine:0,
    });
    const fetchTotalSales = useCallback(async () => {
        const response = await axios.get(`${DASHBOARD_API_ENDPOINTS.TOTAL_SALES}`);
        if(response.status === 200){
            setTotalSales(response.data);
        }
    }, []);

    const fetchTotalMachine = useCallback(async () => {
        const response = await axios.get(`${DASHBOARD_API_ENDPOINTS.TOTAL_MACHINE}`);
        if(response.status === 200){
            setTotalMachine(response.data);
        }
    }, []);

    useEffect(() => {
        fetchTotalSales();
        fetchTotalMachine();
    }, [fetchTotalSales, fetchTotalMachine]);

    return{
        totalSales,
        totalMachine,
    }
}

export const useDashboardGraphData = () => {
    const [graphData, setGraphData] = useState({
        graphDataByDay: null,
        graphDataByWeek: null,
        graphDataByMonth: null,
        graphDataByYear: null,
        branchTotalMachine: null,
        branchTotalSale: null
    });
    const fetchGraphData = useCallback(async (branchId: string) => {
        const response = await axios.get(`${DASHBOARD_API_ENDPOINTS.GRAPH_DATA}?branchId=${branchId}`);
        if(response.status === 200){
            setGraphData(response.data);
        }
    }, []);

    return {
        graphData,
        fetchGraphData,
    }
}

export const useDashboardMachineStatus = () => {
    const [machineStatus, setMachineStatus] =
        useState<MachineStatusData | null>(null);

    const fetchMachineStatus = useCallback(async (branchId: string) => {
        const response = await axios.get(
            `${DASHBOARD_API_ENDPOINTS.MACHINE_STATUS}?branchId=${branchId}`
        );
        if (response.status === 200 && response.data) {
            const data = response.data as MachineStatusApiResponse;
            const items = data.items ?? [];
            const grouped = groupMachineStatusItems(items);

            setMachineStatus({
                summary: {
                    totalMachine: data.summary?.totalMachine ?? 0,
                    totalOnlineActive: data.summary?.totalOnlineActive ?? 0,
                    totalOnlineInactive: data.summary?.totalOnlineInactive ?? 0,
                    totalOperationalActive:
                        data.summary?.totalOperationalActive ?? 0,
                    totalOperationalStandby:
                        data.summary?.totalOperationalStandby ?? 0,
                },
                ...grouped,
            });
        } else {
            setMachineStatus(EMPTY_MACHINE_STATUS);
        }
    }, []);

    return {
        machineStatus,
        fetchMachineStatus,
    };
};