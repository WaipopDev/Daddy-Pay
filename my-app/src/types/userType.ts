export interface UserDataItemDataProps {
    id: string;
    username: string;
    email: string;
    role: string;
    active: boolean;
    subscribe: boolean;
    isVerified: boolean;
    isAdminLevel: number;
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