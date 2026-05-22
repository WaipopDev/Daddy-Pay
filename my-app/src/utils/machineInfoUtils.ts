import _ from 'lodash';
import type { MachineListItem } from '@/types/machineInfoType';

export interface FilterOption {
    label: string;
    value: string;
}

export const getAllFilterOption = (allLabel: string): FilterOption => ({
    label: allLabel,
    value: '',
});

export const buildMachineTypeFilterOptions = (
    machines: MachineListItem[],
    allLabel: string
): FilterOption[] => {
    const types = _.sortBy(_.uniq(machines.map((m) => m.machineType)));
    return [
        getAllFilterOption(allLabel),
        ...types.map((type) => ({ label: type, value: type })),
    ];
};

export const buildMachineBrandFilterOptions = (
    machines: MachineListItem[],
    machineType: string,
    allLabel: string
): FilterOption[] => {
    const filtered = machineType
        ? machines.filter((m) => m.machineType === machineType)
        : machines;
    const brands = _.sortBy(_.uniq(filtered.map((m) => m.machineBrand)));
    return [
        getAllFilterOption(allLabel),
        ...brands.map((brand) => ({ label: brand, value: brand })),
    ];
};

export const buildMachineModelFilterOptions = (
    machines: MachineListItem[],
    machineType: string,
    machineBrand: string,
    allLabel: string
): FilterOption[] => {
    let filtered = machines;
    if (machineType) {
        filtered = filtered.filter((m) => m.machineType === machineType);
    }
    if (machineBrand) {
        filtered = filtered.filter((m) => m.machineBrand === machineBrand);
    }
    const models = _.sortBy(_.uniq(filtered.map((m) => m.machineModel)));
    return [
        getAllFilterOption(allLabel),
        ...models.map((model) => ({ label: model, value: model })),
    ];
};
