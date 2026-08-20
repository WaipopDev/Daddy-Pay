export interface MachineStatusLatestBranchIncomeTransaction {
    id: string;
    createdAt: string;
    transactionIot: string | null;
    transactionId: string | null;
    priceType: string;
    price: number | string;
    shopInfo: {
        shopName: string;
    };
    machineInfo: {
        machineType: string;
    };
    programInfo: {
        programName: string;
    };
    shopManagement: {
        shopManagementName: string;
    };
}

export interface MachineStatusItem {
    id: string;
    shopManagementName: string;
    shopManagementMachineID: string;
    shopManagementIotID: string;
    shopManagementStatus: string;
    shopManagementStatusOnline: string;
    status: string;
    lastConnect: string;
    errorMessage: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
    machinePicturePath: string;
    lastTransactionCreatedAt: string | null;
    machineProgramOperationTime: string | number | null;
    latestBranchIncomeTransaction?: MachineStatusLatestBranchIncomeTransaction | null;
}

export interface MachineStatusSummary {
    totalMachine: number;
    totalOnlineActive: number;
    totalOnlineInactive: number;
    totalOperationalActive: number;
    totalOperationalStandby: number;
}

export interface MachineStatusData {
    summary: MachineStatusSummary;
    availableItems: MachineStatusItem[];
    operatingItems: MachineStatusItem[];
    disconnectedItems: MachineStatusItem[];
    latestBranchIncomeTransactions: MachineStatusLatestBranchIncomeTransaction[];
}

export interface MachineStatusApiResponse {
    summary: MachineStatusSummary;
    items: MachineStatusItem[];
}
