'use client';

import React from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePickerRange from '@/components/FormGroup/DatePickerRange';

interface ShopManagementTransactionFilterProps {
    dateLabel: string;
    searchLabel: string;
    dateRange: [Date | null, Date | null];
    isLoading: boolean;
    onDateChange: (value: [Date | null, Date | null]) => void;
    onSearch: () => void;
}

const ShopManagementTransactionFilter: React.FC<ShopManagementTransactionFilterProps> = ({
    dateLabel,
    searchLabel,
    dateRange,
    isLoading,
    onDateChange,
    onSearch,
}) => (
    <Form
        className="flex flex-col md:flex-row md:items-end gap-3 pb-3 mb-4 border-b border-gray-200"
        onSubmit={(e) => {
            e.preventDefault();
            onSearch();
        }}
    >
        <Form.Group className="w-full md:w-1/3">
            <Form.Label className="text-sm md:text-base">{dateLabel}</Form.Label>
            <DatePickerRange dateValue={dateRange} onChange={onDateChange} />
        </Form.Group>
        <Form.Group className="flex items-end shrink-0">
            <Button
                variant="primary"
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
            >
                <i className="fa-solid fa-search mr-2"></i>
                {searchLabel}
            </Button>
        </Form.Group>
    </Form>
);

export default ShopManagementTransactionFilter;
