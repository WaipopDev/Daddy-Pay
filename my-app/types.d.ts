type UserAdmin = {
    birthDate   : string | null;
    department  : string;
    email       : string;
    firstName   : string;
    id          : number;
    idCard      : string;
    lastName    : string;
    mobileNo    : string;
    orgAddress  : string | null;
    orgName     : string | null;
    orgShortName: string | null;
    orgType     : string | null;
    position    : string;
    prefixId    : number;
    userAddress : string | null;
    username    : string;
    permissions : permissionStage[];
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
    auth  : AuthState;
    modal : ModalsState;
    customer: any;
    basicData: any;
}

type DefaultSearchLogProps = {
    search    ?: string;
    ip        ?: string;
    type      ?: string;
    statusCode?: number;
    method    ?: string;
    page      : number;
}

type PrefixProps = {
    id   : number;
    label: string;
}
type PermissionProps = {
    id   : number;
    label: string;
}
type MasterData = {
    prefix    : PrefixProps[];
    permission: PermissionProps[];
}
