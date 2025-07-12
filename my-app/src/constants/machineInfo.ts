
export const MACHINE_INFO_ROUTES = {
    LIST: '/api/machine-info',
    ADD: '/api/machine-info/add',
    EDIT: (id: string) => `/api/machine-info/edit/${id}`,
} as const;

export const MACHINE_INFO_API_ENDPOINTS = {
    BASE: '/api/machine-info',
    GET_BY_ID: (id: string) => `/api/machine-info/by/${id}`,
    DELETE: (machineId: string) => `/api/machine-info?machineId=${machineId}`,
} as const;


export const MACHINE_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
} as const;


export const MACHINE_INFO_TABLE_CONFIG = {
    COLUMN_COUNT: 11,
} as const;
