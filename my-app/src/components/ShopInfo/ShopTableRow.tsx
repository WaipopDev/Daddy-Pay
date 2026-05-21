import React from 'react';
import { Button } from 'react-bootstrap';
import { ShopTableRowProps } from '@/types/shopInfoType';
import {
    formatOnlinePaymentStatus,
    formatShopStatus,
    formatSubscriptionStatus,
} from '@/utils/shopInfoUtils';
import { PAGINATION_CONFIG } from '@/constants/main';
import { getRowNumber } from '@/utils/main';

/**
 * ShopTableRow Component
 * Renders a single row in the shop information table
 */
const ShopTableRow: React.FC<ShopTableRowProps> = ({ 
    item, 
    index, 
    currentPage, 
    lang, 
    onEdit, 
    onDelete,
    onEditBank,
    onEditOnlinePayment,
}) => {
    const rowNumber = getRowNumber(index, currentPage, PAGINATION_CONFIG.ITEMS_PER_PAGE);
    const statusDisplay = formatShopStatus(item.shopStatus, lang);
    const onlinePaymentStatusDisplay = formatOnlinePaymentStatus(item.onlinePaymentStatus, lang);
    const subscriptionStatusDisplay = formatSubscriptionStatus(item.subSubscriptionStatus, lang);
    return (
        <tr>
            <td>{rowNumber}</td>
            <td>{item.shopCode}</td>
            <td>{item.shopName}</td>
            <td>
                <span className={statusDisplay.className}>
                    {statusDisplay.text}
                </span>
            </td>
            <td className="text-center">
                <span className={onlinePaymentStatusDisplay.className}>
                    {onlinePaymentStatusDisplay.text}
                </span>
            </td>
            <td>{item.subRegistrationDate || '-'}</td>
            <td>{item.subExpirationDate || '-'}</td>
            <td className="text-center">
                <span className={subscriptionStatusDisplay.className}>
                    {subscriptionStatusDisplay.text}
                </span>
            </td>
            <td>{item.shopContactInfo}</td>
            <td>{item.shopMobilePhone}</td>
            <td>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEditOnlinePayment(item)}
                    title={lang['button_edit_online_payment']}
                >
                    <i className="fa-solid fa-credit-card" aria-hidden="true"></i>
                </Button>
                <Button
                    variant="info"
                    size="sm"
                    className="ml-2"
                    onClick={() => onEditBank(item.id)}
                    title={lang['button_edit_bank']}
                >
                    <i className="fa-solid fa-bank" aria-hidden="true"></i>
                </Button>
                <Button 
                    variant="warning" 
                    size="sm" 
                    className="ml-2" 
                    onClick={() => onEdit(item.id)}
                    title={lang['button_edit']}
                >
                    <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                </Button>
                <Button 
                    variant="danger" 
                    size="sm" 
                    className="ml-2" 
                    onClick={() => onDelete(item.id)}
                    title={lang['button_delete']}
                >
                    <i className="fa-solid fa-trash" aria-hidden="true"></i>
                </Button>
            </td>
        </tr>
    );
};

ShopTableRow.displayName = 'ShopTableRow';

export default ShopTableRow;
