import React from 'react';
import { UserDataItemDataProps } from '@/types/userType';
import { formatUserStatus, formatUserRole, formatUserSubscription } from '@/utils/userInfoUtils';
import { Button } from 'react-bootstrap';

interface UserTableRowProps {
    item: UserDataItemDataProps;
    index: number;
    currentPage: number;
    lang: { [key: string]: string };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

/**
 * UserTableRow Component
 * Renders a single row in the user table
 */
const UserTableRow: React.FC<UserTableRowProps> = ({
    item,
    index,
    currentPage,
    lang,
    onEdit,
    onDelete,
}) => {
    const rowNumber = (currentPage - 1) * 10 + index + 1;
    const statusInfo = formatUserStatus(item.active, lang);
    const roleInfo = formatUserRole(item.role, lang);
    const subscriptionInfo = formatUserSubscription(item.subscribe, lang);

    return (
        <tr>
            <td className="text-center">{rowNumber}</td>
            <td>{item.username}</td>
            <td>{item.email}</td>
            <td>
                <span className={`badge ${statusInfo.className}`}>
                    {statusInfo.text}
                </span>
            </td>
            <td>
                <span className={`badge ${roleInfo.className}`}>
                    {roleInfo.text}
                </span>
            </td>
            <td>
                <span className={`badge ${subscriptionInfo.className}`}>
                    {subscriptionInfo.text}
                </span>
            </td>
            <td>
                <span className={`badge ${item.isVerified ? 'bg-success' : 'bg-warning'}`}>
                    {item.isVerified ? (lang['global_verified'] || 'Verified') : (lang['global_unverified'] || 'Unverified')}
                </span>
            </td>
            <td className="text-center">
                <Button variant="warning" size="sm" onClick={() => onEdit(item.id)}><i className="fa-solid fa-pen-to-square"></i></Button>
                <Button variant="danger" size="sm" className="ml-2" onClick={() => onDelete(item.id)}><i className="fa-solid fa-trash"></i></Button>
            </td>
        </tr>
    );
};

UserTableRow.displayName = 'UserTableRow';

export default UserTableRow;
