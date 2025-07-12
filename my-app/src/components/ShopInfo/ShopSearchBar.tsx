import React, { useState, useCallback } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

interface ShopSearchBarProps {
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
    disabled?: boolean;
    lang: { [key: string]: string };
}

/**
 * ShopSearchBar Component
 * Provides search functionality for the shop info page
 */
const ShopSearchBar: React.FC<ShopSearchBarProps> = ({ 
    onSearch, 
    placeholder,
    disabled = false,
    lang 
}) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchValue.trim());
    }, [onSearch, searchValue]);

    const handleClear = useCallback(() => {
        setSearchValue('');
        onSearch('');
    }, [onSearch]);

    return (
        <Form onSubmit={handleSubmit} className="mb-3">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder={placeholder || lang['global_search'] || 'Search...'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    disabled={disabled}
                />
                <Button 
                    variant="outline-secondary" 
                    type="submit"
                    disabled={disabled}
                    title={lang['button_search']}
                >
                    <i className="fa-solid fa-search" aria-hidden="true"></i>
                </Button>
                {searchValue && (
                    <Button 
                        variant="outline-secondary" 
                        type="button" 
                        onClick={handleClear}
                        disabled={disabled}
                        title={lang['button_clear']}
                    >
                        <i className="fa-solid fa-times" aria-hidden="true"></i>
                    </Button>
                )}
            </InputGroup>
        </Form>
    );
};

ShopSearchBar.displayName = 'ShopSearchBar';

export default ShopSearchBar;
