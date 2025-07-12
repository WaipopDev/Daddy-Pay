export interface ItemMachineInfoDataProps {
    id                : string;
    machineKey        : string;
    machineType       : string;
    machineBrand      : string;
    machineModel      : string;
    machineDescription: string;
    machinePicturePath: string;
    createdAt         : string;
    updatedAt         : string;
}

export interface MachineTableRowProps {
    item: ItemMachineInfoDataProps;
    index: number;
    currentPage: number;
    lang: { [key: string]: string };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}