export interface ShopManagementTransactionShopInfo {
    id?: string;
    shopName?: string;
    [key: string]: unknown;
}

export interface ShopManagementTransactionMachineInfo {
    id?: string;
    machineType?: string;
    machineModel?: string;
    machineBrand?: string;
    machineName?: string;
    shopManagementName?: string;
    [key: string]: unknown;
}

export interface ShopManagementTransactionProgramInfo {
    id?: string;
    programName?: string;
    programDescription?: string;
    [key: string]: unknown;
}

export interface ShopManagementTransactionItem {
    id: string;
    shopManagementId: string;
    priceType: string;
    status: string;
    price: number;
    transactionId: string;
    createdAt: string;
    shopInfo?: ShopManagementTransactionShopInfo;
    machineInfo?: ShopManagementTransactionMachineInfo;
    programInfo?: ShopManagementTransactionProgramInfo;
}

export interface ShopManagementTransactionMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface ShopManagementTransactionResponse {
    items: ShopManagementTransactionItem[];
    meta: ShopManagementTransactionMeta;
}

export interface ShopManagementTransactionSearch {
    startDate: string;
    endDate: string;
}
