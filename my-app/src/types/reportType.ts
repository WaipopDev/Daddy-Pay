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
        deletedAt?: string;
    }
}

export interface ReportBankPaymentItemDataProps {
    createdAt: string;
    transactionId: string;
    merchantId: string;
    programName: string;
    reference1: string;
    reference2: string;
    shopManagementName: string;
    shopName:string;
    txnAmount:string;
    txnNo:string;
    machineType: string;
}