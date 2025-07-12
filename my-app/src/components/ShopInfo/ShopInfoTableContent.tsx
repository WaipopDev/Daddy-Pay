import React from 'react';
import { ShopInfoItemDataProps } from '@/types/shopInfoType';
import { SHOP_INFO_TABLE_CONFIG } from '@/constants/shopInfo';
import ShopTableRow from './ShopTableRow';
import LoadingSkeleton from '../Table/LoadingSkeleton';

interface ShopInfoTableContentProps {
    items: ShopInfoItemDataProps[] | null;
    currentPage: number;
    lang: { [key: string]: string };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

/**
 * ShopInfoTableContent Component
 * Renders the content of the shop info table (rows)
 */
const ShopInfoTableContent: React.FC<ShopInfoTableContentProps> = ({
    items,
    currentPage,
    lang,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    // Loading state
    if (isLoading) {
        return <LoadingSkeleton columnCount={SHOP_INFO_TABLE_CONFIG.COLUMN_COUNT} />;
    }

    // No data state
    if (!items || items.length === 0) {
        return (
            <tr>
                <td colSpan={SHOP_INFO_TABLE_CONFIG.COLUMN_COUNT} className="text-center">
                    {lang['global_no_data'] || 'ไม่มีข้อมูล'}
                </td>
            </tr>
        );
    }

    // Render shop items
    return (
        <>
            {items.map((item, index) => (
                <ShopTableRow
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

ShopInfoTableContent.displayName = 'ShopInfoTableContent';

export default ShopInfoTableContent;
