export interface UserInfoSearchParams {
    username: string;
    email: string;
    subscribe: string;
    isVerified: string;
}

export interface UserDataItemDataProps {
    id: string;
    username: string;
    email: string;
    role: string;
    active: boolean;
    subscribe: boolean;
    subscribeStartDate?: string | null;
    subscribeEndDate?: string | null;
    isVerified: boolean;
    isAdminLevel: number;
    permissions: {
        shopId: string;
    }[];
}

export interface UserSubscribeFormData {
    subscribe: boolean;
    subscribeStartDate: string;
    subscribeEndDate: string;
}

export interface UserModalSubscribeState {
    isShow: boolean;
    userId: string;
    username: string;
    initialData?: UserSubscribeFormData;
}

export interface UserModalDeleteState {
    isShow: boolean;
    id: string;
}

export interface UserModalEditState {
    isShow: boolean;
    id: string;
    data?: UserDataItemDataProps;
}