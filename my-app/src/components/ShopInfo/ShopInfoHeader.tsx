import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import ShopSearchBar from './ShopSearchBar';

interface ShopInfoHeaderProps {
    onAddShop: () => void;
    onSearch?: (searchTerm: string) => void;
    lang: { [key: string]: string };
    isLoading?: boolean;
}

/**
 * ShopInfoHeader Component
 * Renders the header section with action buttons and search functionality for shop info page
 */
const ShopInfoHeader: React.FC<ShopInfoHeaderProps> = ({ 
    onAddShop, 
    // onSearch,
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
                        onClick={onAddShop}
                        disabled={isLoading}
                        aria-label={lang['button_add_shop']}
                    >
                        <i className="fa-solid fa-plus pr-2" aria-hidden="true"></i>
                        {lang['button_add_shop']}
                    </Button>
                </Col>
            </div>
            
            {/* {onSearch && (
                <Row className="mt-3">
                    <Col md={6}>
                        <ShopSearchBar
                            onSearch={onSearch}
                            placeholder={`${lang['global_search']} ${lang['page_shop_info_shop_name']}, ${lang['page_shop_info_shop_code']}...`}
                            disabled={isLoading}
                            lang={lang}
                        />
                    </Col>
                </Row>
            )} */}
        </div>
    );
};

ShopInfoHeader.displayName = 'ShopInfoHeader';

export default ShopInfoHeader;
