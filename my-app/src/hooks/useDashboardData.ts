import { useCallback, useEffect, useState } from "react";
import { DASHBOARD_API_ENDPOINTS } from "@/constants/dashboard";
import axios from "axios";

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