import React from 'react';
import { Button, Col } from 'react-bootstrap';

interface UserInfoHeaderProps {
    onAddUser: () => void;
    onSearch?: (searchTerm: string) => void;
    lang: { [key: string]: string };
    isLoading?: boolean;
}

/**
 * UserInfoHeader Component
 * Renders the header section with action buttons and search functionality for user management page
 */
const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({ 
    onAddUser, 
    onSearch,
    lang, 
    isLoading = false 
}) => {
    return (
        <div className="mb-3">
            <div className="flex border-b border-gray-300 pb-2">
                <Col className="flex justify-start" />
                <Col className="flex justify-end">
                    <Button 
                        variant="primary" 
                        onClick={onAddUser}
                        disabled={isLoading}
                        aria-label={lang['button_add_user'] || 'Add User'}
                    >
                        <i className="fa-solid fa-plus pr-2" aria-hidden="true"></i>
                        {lang['button_add_user'] || 'Add User'}
                    </Button>
                </Col>
            </div>
            
            {onSearch && (
                <div className="mt-3">
                    <div className="md:w-1/2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`${lang['global_search'] || 'Search'} ${lang['page_user_username'] || 'Username'}, ${lang['page_user_email'] || 'Email'}...`}
                            disabled={isLoading}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

UserInfoHeader.displayName = 'UserInfoHeader';

export default UserInfoHeader;
