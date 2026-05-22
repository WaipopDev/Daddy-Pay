'use client';

import React, { useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { cn } from '@/lib/utils';
import {
    getUserSubscribeFilterOptions,
    getUserVerifiedFilterOptions,
} from '@/constants/user';
import type { UserInfoSearchParams } from '@/types/userType';

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

    const subscribeLabel =
        subscribeOptions.find((item) => item.value === subscribe)?.label ||
        lang['global_all'];
    const verifiedLabel =
        verifiedOptions.find((item) => item.value === isVerified)?.label ||
        lang['global_all'];

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
                <Dropdown className="nav-dropdown-w">
                    <Dropdown.Toggle
                        className={cn(
                            'flex items-center w-full min-w-0 px-2 py-2 rounded-md h-[35px] text-sm'
                        )}
                        disabled={isLoading}
                    >
                        <p className="px-2 flex-1 min-w-0 text-left text-xs md:text-sm truncate">
                            {subscribeLabel}
                        </p>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {subscribeOptions.map((item) => (
                            <Dropdown.Item
                                key={item.value || 'all-subscribe'}
                                onClick={() => setSubscribe(item.value)}
                                active={subscribe === item.value}
                            >
                                {item.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-sm md:text-base">
                    {lang['page_user_verified']}
                </Form.Label>
                <Dropdown className="nav-dropdown-w">
                    <Dropdown.Toggle
                        className={cn(
                            'flex items-center w-full min-w-0 px-2 py-2 rounded-md h-[35px] text-sm'
                        )}
                        disabled={isLoading}
                    >
                        <p className="px-2 flex-1 min-w-0 text-left text-xs md:text-sm truncate">
                            {verifiedLabel}
                        </p>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {verifiedOptions.map((item) => (
                            <Dropdown.Item
                                key={item.value || 'all-verified'}
                                onClick={() => setIsVerified(item.value)}
                                active={isVerified === item.value}
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

export default UserInfoFilter;
