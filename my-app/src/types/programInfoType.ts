import type { MachineListItem } from '@/types/machineInfoType';

export interface ProgramInfoSearchParams {
    programName: string;
    machineType: string;
    machineBrand: string;
}

export interface ProgramInfoMachineInfo {
    id: string;
    machineKey: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
    machineDescription: string;
    machinePicturePath: string;
}

export interface ProgramInfoItem {
    id: string;
    programKey: string;
    programName: string;
    programDescription: string;
    machineInfo: ProgramInfoMachineInfo | null;
    createdAt: string;
    updatedAt: string;
}

export type { MachineListItem };
