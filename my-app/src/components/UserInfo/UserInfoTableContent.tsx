import React from 'react';
import { UserDataItemDataProps } from '@/types/userType';
import { USER_TABLE_CONFIG } from '@/constants/user';
import UserTableRow from './UserTableRow';
import LoadingSkeleton from '../Table/LoadingSkeleton';

interface UserInfoTableContentProps {
    items: UserDataItemDataProps[] | null;
    currentPage: number;
    lang: { [key: string]: string };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

/**
 * UserInfoTableContent Component
 * Renders the content of the user info table (rows)
 */
const UserInfoTableContent: React.FC<UserInfoTableContentProps> = ({
    items,
    currentPage,
    lang,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    // Loading state
    if (isLoading) {
        return <LoadingSkeleton columnCount={USER_TABLE_CONFIG.COLUMN_COUNT} />;
    }

    // No data state
    if (!items || items.length === 0) {
        return (
            <tr>
                <td colSpan={USER_TABLE_CONFIG.COLUMN_COUNT} className="text-center">
                    {lang['global_no_data'] || 'ไม่มีข้อมูล'}
                </td>
            </tr>
        );
    }

    // Render user items
    return (
        <>
            {items.map((item, index) => (
                <UserTableRow
                    key={item.id}
                    item={item}
                    index={index}
                    currentPage={currentPage}
                    lang={lang}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};

UserInfoTableContent.displayName = 'UserInfoTableContent';

export default UserInfoTableContent;
