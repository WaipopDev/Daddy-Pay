'use client';

import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { cn } from '@/lib/utils';

export interface SearchableDropdownOption {
    label: string;
    value: string;
}

interface SearchableDropdownProps {
    items: SearchableDropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    className?: string;
    toggleClassName?: string;
    labelClassName?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    items,
    value,
    onChange,
    placeholder = 'Select',
    searchPlaceholder = 'Search',
    disabled = false,
    className = 'nav-dropdown-w',
    toggleClassName,
    labelClassName,
}) => {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');

    const selectedLabel =
        items.find((item) => item.value === value)?.label || placeholder;

    const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = (isOpen: boolean) => {
        setShow(isOpen);
        if (!isOpen) setSearch('');
    };

    const handleSelect = (itemValue: string) => {
        onChange(itemValue);
        setShow(false);
        setSearch('');
    };

    return (
        <Dropdown
            className={className}
            show={show}
            onToggle={handleToggle}
            autoClose="outside"
        >
            <Dropdown.Toggle
                className={cn(
                    'flex items-center w-full min-w-0 px-2 py-2 rounded-md h-[35px] text-sm',
                    toggleClassName
                )}
                disabled={disabled}
            >
                <p
                    className={cn(
                        'px-2 flex-1 min-w-0 text-left text-xs md:text-sm truncate',
                        labelClassName
                    )}
                >
                    {selectedLabel}
                </p>
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-0 w-100">
                <div className="p-2 border-bottom sticky top-0 bg-white z-10">
                    <Form.Control
                        type="text"
                        size="sm"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        disabled={disabled}
                    />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {filteredItems.map((item) => (
                        <Dropdown.Item
                            key={`${item.value}-${item.label}`}
                            onClick={() => handleSelect(item.value)}
                            active={value === item.value}
                        >
                            {item.label}
                        </Dropdown.Item>
                    ))}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SearchableDropdown;
