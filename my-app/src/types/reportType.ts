export interface ReportBranchIncomeItemDataProps {
    id: string;
    createdAt: string;
    shopInfoId: string;
    priceType: string;
    transactionId: string;
    transactionIot: string;
    price:string;
    shopInfo:{
        shopName: string;
    },
    machineInfo:{
        machineType: string;
    },
    programInfo:{
        programName: string;
    },
    shopManagement:{
        shopManagementName: string;
    }
}