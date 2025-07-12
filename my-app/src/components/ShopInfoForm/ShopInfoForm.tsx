import React from "react";
import { useAppSelector } from "@/store/hook";
import { Row } from "react-bootstrap";
import InputForm from "../FormGroup/inputForm";
import DropdownForm from "../FormGroup/dropdownForm";
import UploadFileForm from "../FormGroup/uploadFileForm";
import { ItemShopInfoDataProps } from "@/types/shopInfoType";
import Image from "next/image";

interface ShopInfoFormProps {
    item?: ItemShopInfoDataProps | null;
    action?: 'add' | 'edit';
}

const ShopInfoForm: React.FC<ShopInfoFormProps> = ({ item = null, action = 'add' }) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }

    const renderShopInfoSection = () => (
        <>
            <div className="flex border-b border-gray-300">
                <p className="bg-[#F2F2F2] p-2 font-bold">{lang['page_shop_info_shop_info']}</p>
            </div>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_shop_code']}
                    placeholder={lang['page_shop_info_shop_code']}
                    name="shopCode"
                    required
                    defaultValue={item?.shopCode || ''}
                />
                <InputForm
                    label={lang['page_shop_info_shop_name']}
                    placeholder={lang['page_shop_info_shop_name']}
                    name="shopName"
                    required
                    defaultValue={item?.shopName || ''}
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_shop_address']}
                    placeholder={lang['page_shop_info_shop_address']}
                    name="shopAddress"
                    defaultValue={item?.shopAddress || ''}
                />
                <InputForm
                    label={lang['page_shop_info_contact_info']}
                    placeholder={lang['page_shop_info_contact_info']}
                    name="shopContactInfo"
                    defaultValue={item?.shopContactInfo || ''}
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_mobile_phone']}
                    placeholder={lang['page_shop_info_mobile_phone']}
                    name="shopMobilePhone"
                    defaultValue={item?.shopMobilePhone || ''}
                />
                <InputForm
                    label={lang['page_shop_info_email']}
                    placeholder={lang['page_shop_info_email']}
                    name="shopEmail"
                    defaultValue={item?.shopEmail || ''}
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_latitude']}
                    placeholder={lang['page_shop_info_latitude']}
                    name="shopLatitude"
                    defaultValue={item?.shopLatitude || ''}
                />
                <InputForm
                    label={lang['page_shop_info_longitude']}
                    placeholder={lang['page_shop_info_longitude']}
                    name="shopLongitude"
                    defaultValue={item?.shopLongitude || ''}
                />
            </Row>
            <Row className="pt-2">
                <DropdownForm
                    label={lang['global_status']}
                    defaultValue={item?.shopStatus || 'active'}
                    name="shopStatus"
                    required
                    items={[
                        { label: lang['global_active'], value: 'active' },
                        { label: lang['global_inactive'], value: 'inactive' }
                    ]}
                />
                <InputForm
                    label={lang['page_shop_info_system_name']}
                    placeholder={lang['page_shop_info_system_name']}
                    name="shopSystemName"
                    required
                    defaultValue={item?.shopSystemName || ''}
                />
            </Row>
            <Row className="pt-2">
                <div className="col-6">
                    <UploadFileForm
                        label={lang['global_logo']}
                        placeholder={lang['global_logo']}
                        name="shopUploadFile"
                        required={action === 'add'}
                    />
                </div>
                {action === 'edit' && item?.shopUploadFile && (
                    <div className="col-6">
                        <Image 
                            src={item.shopUploadFile} 
                            alt="Shop Logo" 
                            width={100} 
                            height={100} 
                            style={{ width: 'auto', height: 'auto' }} 
                            priority 
                        />
                    </div>
                )}
            </Row>
        </>
    );

    const renderTaxInvoiceSection = () => (
        <>
            <div className="flex border-b border-gray-300 pt-1">
                <p className="bg-[#F2F2F2] p-2 font-bold">{lang['page_shop_info_tax_invoice']}</p>
            </div>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_tax_name']}
                    placeholder={lang['page_shop_info_tax_name']}
                    name="shopTaxName"
                    defaultValue={item?.shopTaxName || ''}
                />
                <InputForm
                    label={lang['page_shop_info_tax_id']}
                    placeholder={lang['page_shop_info_tax_id']}
                    name="shopTaxId"
                    defaultValue={item?.shopTaxId || ''}
                />
            </Row>
            <Row className="pt-2">
                <div className="col-6">
                    <InputForm
                        label={lang['page_shop_info_tax_address']}
                        placeholder={lang['page_shop_info_tax_address']}
                        name="shopTaxAddress"
                        defaultValue={item?.shopTaxAddress || ''}
                    />
                </div>
            </Row>
        </>
    );

    const renderBankInfoSection = () => (
        <>
            <div className="flex border-b border-gray-300 pt-1">
                <p className="bg-[#F2F2F2] p-2 font-bold">{lang['page_shop_info_bank_information']}</p>
            </div>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_bank_account']}
                    placeholder={lang['page_shop_info_bank_account']}
                    name="shopBankAccount"
                    required
                    defaultValue={item?.shopBankAccount || ''}
                />
                <InputForm
                    label={lang['page_shop_info_bank_account_number']}
                    placeholder={lang['page_shop_info_bank_account_number']}
                    name="shopBankAccountNumber"
                    required
                    defaultValue={item?.shopBankAccountNumber || ''}
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_bank_name']}
                    placeholder={lang['page_shop_info_bank_name']}
                    name="shopBankName"
                    required
                    defaultValue={item?.shopBankName || ''}
                />
                <InputForm
                    label={lang['page_shop_info_bank_branch']}
                    placeholder={lang['page_shop_info_bank_branch']}
                    name="shopBankBranch"
                    required
                    defaultValue={item?.shopBankBranch || ''}
                />
            </Row>
        </>
    );

    return (
        <div className="text-sm">
            {renderShopInfoSection()}
            {renderTaxInvoiceSection()}
            {renderBankInfoSection()}
        </div>
    );
};

export default ShopInfoForm;