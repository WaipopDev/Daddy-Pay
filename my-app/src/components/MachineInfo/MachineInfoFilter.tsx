'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import type { MachineInfoSearchParams, MachineListItem } from '@/types/machineInfoType';
import {
    buildMachineBrandFilterOptions,
    buildMachineModelFilterOptions,
    buildMachineTypeFilterOptions,
} from '@/utils/machineInfoUtils';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface MachineInfoFilterProps {
    lang: Record<string, string>;
    isLoading?: boolean;
    onSearch: (filters: MachineInfoSearchParams) => void;
}

const MachineInfoFilter: React.FC<MachineInfoFilterProps> = ({
    lang,
    isLoading = false,
    onSearch,
}) => {
    const [machines, setMachines] = useState<MachineListItem[]>([]);
    const [machineType, setMachineType] = useState('');
    const [machineBrand, setMachineBrand] = useState('');
    const [machineModel, setMachineModel] = useState('');

    const fetchMachineList = useCallback(async () => {
        try {
            const response = await axios.get<MachineListItem[]>('/api/machine-info/list');
            if (response.status === 200) {
                setMachines(response.data);
            }
        } catch (error) {
            console.error('Error fetching machine list:', error);
        }
    }, []);

    useEffect(() => {
        fetchMachineList();
    }, [fetchMachineList]);

    const allLabel = lang['global_all'];

    const typeOptions = useMemo(
        () => buildMachineTypeFilterOptions(machines, allLabel),
        [machines, allLabel]
    );

    const brandOptions = useMemo(
        () => buildMachineBrandFilterOptions(machines, machineType, allLabel),
        [machines, machineType, allLabel]
    );

    const modelOptions = useMemo(
        () => buildMachineModelFilterOptions(machines, machineType, machineBrand, allLabel),
        [machines, machineType, machineBrand, allLabel]
    );

    const handleTypeChange = (value: string) => {
        setMachineType(value);
        setMachineBrand('');
        setMachineModel('');
    };

    const handleBrandChange = (value: string) => {
        setMachineBrand(value);
        setMachineModel('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ machineType, machineBrand, machineModel });
    };

    return (
        <Form
            className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-3 mb-4 border-b border-gray-200"
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_machine_info_machine_type']}
                </Form.Label>
                <SearchableDropdown
                    items={typeOptions.map((item) => ({
                        label: item.label,
                        value: item.value,
                    }))}
                    value={machineType}
                    onChange={handleTypeChange}
                    placeholder={allLabel}
                    searchPlaceholder={lang['global_search']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_machine_info_brand']}
                </Form.Label>
                <SearchableDropdown
                    items={brandOptions.map((item) => ({
                        label: item.label,
                        value: item.value,
                    }))}
                    value={machineBrand}
                    onChange={handleBrandChange}
                    placeholder={allLabel}
                    searchPlaceholder={lang['global_search']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_machine_info_model']}
                </Form.Label>
                <SearchableDropdown
                    items={modelOptions.map((item) => ({
                        label: item.label,
                        value: item.value,
                    }))}
                    value={machineModel}
                    onChange={setMachineModel}
                    placeholder={allLabel}
                    searchPlaceholder={lang['global_search']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group className="flex items-end">
                <Button
                    variant="primary"
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isLoading}
                >
                    <i className="fa-solid fa-search mr-2"></i>
                    {lang['global_search']}
                </Button>
            </Form.Group>
        </Form>
    );
};

export default MachineInfoFilter;
