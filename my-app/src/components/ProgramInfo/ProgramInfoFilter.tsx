'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import type { MachineListItem, ProgramInfoSearchParams } from '@/types/programInfoType';
import {
    buildMachineBrandFilterOptions,
    buildMachineTypeFilterOptions,
} from '@/utils/machineInfoUtils';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface ProgramInfoFilterProps {
    lang: Record<string, string>;
    isLoading?: boolean;
    onSearch: (filters: ProgramInfoSearchParams) => void;
}

const ProgramInfoFilter: React.FC<ProgramInfoFilterProps> = ({
    lang,
    isLoading = false,
    onSearch,
}) => {
    const [machines, setMachines] = useState<MachineListItem[]>([]);
    const [programName, setProgramName] = useState('');
    const [machineType, setMachineType] = useState('');
    const [machineBrand, setMachineBrand] = useState('');

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

    const handleTypeChange = (value: string) => {
        setMachineType(value);
        setMachineBrand('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            programName: programName.trim(),
            machineType,
            machineBrand,
        });
    };

    return (
        <Form
            className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-3 mb-4 border-b border-gray-200"
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_program_info_program_code']}
                </Form.Label>
                <Form.Control
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder={lang['page_program_info_program_code']}
                    disabled={isLoading}
                />
            </Form.Group>

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
                    onChange={setMachineBrand}
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

export default ProgramInfoFilter;
