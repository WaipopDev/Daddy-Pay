import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";

export const useMasterShopList = () => {
    const [itemShop, setItemShop] = useState<{id:string, shopName:string}[] | []>([]);
    const fetchShopListData = useCallback(async () => {
        try {
            const response = await axios.get('/api/shop-info/list');
            if (response.status === 200) {
                const orderedByType = _.orderBy(response.data, ['shopName'], ['asc']);
                orderedByType.unshift({id:'all', shopName:'All'});
                setItemShop(orderedByType);
                // const groupByType = _.groupBy(response.data, 'machineType');
                // const orderedByType = _.orderBy(groupByType, ['machineType'], ['asc']);
                // setItemMachine(orderedByType);
            }
        } catch (error) {
            console.error("Error fetching shop list:", error);
        }
    }, []);

    useEffect(() => {
        fetchShopListData();
    }, [fetchShopListData]);

    return {
        itemShop,
    }
}

export const useMasterShopListNotAll = () => {
    const [itemShop, setItemShop] = useState<{id:string, shopName:string}[] | []>([]);
    const fetchShopListData = useCallback(async () => {
        try {
            const response = await axios.get('/api/shop-info/list');
            if (response.status === 200) {
                const orderedByType = _.orderBy(response.data, ['shopName'], ['asc']);
                setItemShop(orderedByType);
                // const groupByType = _.groupBy(response.data, 'machineType');
                // const orderedByType = _.orderBy(groupByType, ['machineType'], ['asc']);
                // setItemMachine(orderedByType);
            }
        } catch (error) {
            console.error("Error fetching shop list:", error);
        }
    }, []);

    useEffect(() => {
        fetchShopListData();
    }, [fetchShopListData]);

    return {
        itemShop,
    }
}

export const useMasterMachineList = () => {
    const [itemMachine, setItemMachine] = useState<{id:string, machineName:string}[] | []>([]);
    const fetchMachineListData = useCallback(async () => {
        try {
            const response = await axios.get('/api/machine-info/list');
            if (response.status === 200) {
                setItemMachine(response.data);
            }
        } catch (error) {
            console.error("Error fetching machine list:", error);
        }
    }, []);

    useEffect(() => {
        fetchMachineListData();
    }, [fetchMachineListData]);

    return {
        itemMachine,
    }
}