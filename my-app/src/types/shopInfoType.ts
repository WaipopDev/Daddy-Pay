export interface ItemShopInfoDataProps {
    id                   : string;
    shopCode             : string;
    shopName             : string;
    shopStatus           : string;
    shopContactInfo      : string;
    shopMobilePhone      : string;
    shopEmail            : string;
    shopLatitude         : string;
    shopLongitude        : string;
    shopSystemName       : string;
    shopUploadFile       : string;
    shopTaxName          : string;
    shopTaxId            : string;
    shopTaxAddress       : string;
    shopBankAccount      : string;
    shopBankAccountNumber: string;
    shopBankName         : string;
    shopBankBranch       : string;
    shopAddress          : string;
}


export interface ShopModalDeleteState {
    isShow: boolean;
    id: string;
}

import type {
    OnlinePaymentStatusValue,
    SubscriptionStatusValue,
} from '@/constants/shopInfo';

export interface ShopOnlinePaymentFormData {
    onlinePaymentStatus: OnlinePaymentStatusValue | '';
    onlineActivationDate: string;
    onlineCloseDate: string;
}

export interface ShopModalOnlinePaymentState {
    isShow: boolean;
    shopId: string;
    initialData?: ShopOnlinePaymentFormData;
}

export interface ShopSubscriptionFormData {
    subSubscriptionStatus: SubscriptionStatusValue | '';
    subRegistrationDate: string;
    subExpirationDate: string;
    subNotificationCycle: number | '';
    subNotifyToEmail: string;
}

export interface ShopModalSubscriptionState {
    isShow: boolean;
    shopId: string;
    initialData?: ShopSubscriptionFormData;
}

export interface ShopTableRowProps {
    item: ShopInfoItemDataProps;
    index: number;
    currentPage: number;
    lang: { [key: string]: string };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onEditBank: (id: string) => void;
    onEditOnlinePayment: (item: ShopInfoItemDataProps) => void;
    onEditSubscription: (item: ShopInfoItemDataProps) => void;
}

export interface ShopInfoItemDataProps {
    id: string;
    shopCode: string;
    shopName: string;
    shopStatus: string;
    shopContactInfo: string;
    shopMobilePhone: string;
    onlinePaymentStatus: string;
    onlineActivationDate: string;
    onlineCloseDate: string;
    subRegistrationDate: string;
    subExpirationDate: string;
    subSubscriptionStatus: string;
    subNotificationCycle:number;
    subNotifyToEmail:string;
}

export interface BankFormDataProps {
    consumerId: string;
    consumerSecret: string;
    partnerId: string;
    merchantId: string;
    partnerSecret: string;
}
export interface ShopInfoSearchParams {
    shopName: string;
    shopStatus: string;
}

// API Response Types
export interface ShopInfoApiResponse {
    items: ShopInfoItemDataProps[];
    meta: {
        currentPage: number;
        totalPages: number;
    };
}