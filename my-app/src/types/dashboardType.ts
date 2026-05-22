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
}

export interface MachineStatusApiResponse {
    summary: MachineStatusSummary;
    items: MachineStatusItem[];
}
