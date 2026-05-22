'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import axios from 'axios';
import { cn } from '@/lib/utils';
import type { MachineListItem, ProgramInfoSearchParams } from '@/types/programInfoType';
import {
    buildMachineBrandFilterOptions,
    buildMachineTypeFilterOptions,
} from '@/utils/machineInfoUtils';

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

    const typeLabel =
        typeOptions.find((item) => item.value === machineType)?.label || allLabel;
    const brandLabel =
        brandOptions.find((item) => item.value === machineBrand)?.label || allLabel;

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
                <Dropdown className="nav-dropdown-w">
                    <Dropdown.Toggle
                        className={cn(
                            'flex items-center w-full min-w-0 px-2 py-2 rounded-md h-[35px] text-sm'
                        )}
                        disabled={isLoading}
                    >
                        <p className="px-2 flex-1 min-w-0 text-left text-xs md:text-sm truncate">
                            {typeLabel}
                        </p>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {typeOptions.map((item) => (
                            <Dropdown.Item
                                key={item.value || 'all-type'}
                                onClick={() => handleTypeChange(item.value)}
                                active={machineType === item.value}
                            >
                                {item.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_machine_info_brand']}
                </Form.Label>
                <Dropdown className="nav-dropdown-w">
                    <Dropdown.Toggle
                        className={cn(
                            'flex items-center w-full min-w-0 px-2 py-2 rounded-md h-[35px] text-sm'
                        )}
                        disabled={isLoading}
                    >
                        <p className="px-2 flex-1 min-w-0 text-left text-xs md:text-sm truncate">
                            {brandLabel}
                        </p>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {brandOptions.map((item) => (
                            <Dropdown.Item
                                key={item.value || 'all-brand'}
                                onClick={() => setMachineBrand(item.value)}
                                active={machineBrand === item.value}
                            >
                                {item.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
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
