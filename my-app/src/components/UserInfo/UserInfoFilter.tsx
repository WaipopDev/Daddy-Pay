'use client';

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
    getUserSubscribeFilterOptions,
    getUserVerifiedFilterOptions,
} from '@/constants/user';
import type { UserInfoSearchParams } from '@/types/userType';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface UserInfoFilterProps {
    lang: Record<string, string>;
    isLoading?: boolean;
    onSearch: (filters: UserInfoSearchParams) => void;
}

const UserInfoFilter: React.FC<UserInfoFilterProps> = ({
    lang,
    isLoading = false,
    onSearch,
}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [subscribe, setSubscribe] = useState('');
    const [isVerified, setIsVerified] = useState('');

    const subscribeOptions = getUserSubscribeFilterOptions(lang);
    const verifiedOptions = getUserVerifiedFilterOptions(lang);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            username: username.trim(),
            email: email.trim(),
            subscribe,
            isVerified,
        });
    };

    return (
        <Form
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 pb-3 mb-4 border-b border-gray-200"
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_user_username']}
                </Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={lang['page_user_username_placeholder']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_user_email']}
                </Form.Label>
                <Form.Control
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={lang['page_user_email_placeholder']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_user_subscription']}
                </Form.Label>
                <SearchableDropdown
                    items={subscribeOptions.map((item) => ({
                        label: item.label,
                        value: item.value,
                    }))}
                    value={subscribe}
                    onChange={setSubscribe}
                    placeholder={lang['global_all']}
                    searchPlaceholder={lang['global_search']}
                    disabled={isLoading}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_user_verified']}
                </Form.Label>
                <SearchableDropdown
                    items={verifiedOptions.map((item) => ({
                        label: item.label,
                        value: item.value,
                    }))}
                    value={isVerified}
                    onChange={setIsVerified}
                    placeholder={lang['global_all']}
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

export default UserInfoFilter;
