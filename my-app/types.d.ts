type UserAdmin = {
    id: number;
    username: string;
    email: string;
    role: string;
    active: boolean;
    subscribe: boolean;
    isVerified: boolean;
    isAdminLevel: number;
    subscribeStartDate: string | null;
    subscribeEndDate: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}

interface permissionStage {
    id: number;
    name: string;
}

type RouteProps = {
    path: string;
    name: string;
    icon: string;
    permission: number;
}

type RootState = {
    auth: AuthState;
    modal: ModalsState;
    customer: any;
    basicData: any;
}

type DefaultSearchLogProps = {
    search?: string;
    ip?: string;
    type?: string;
    statusCode?: number;
    method?: string;
    page: number;
}

type PrefixProps = {
    id: number;
    label: string;
}
type PermissionProps = {
    id: number;
    label: string;
}
type MasterData = {
    prefix: PrefixProps[];
    permission: PermissionProps[];
}
