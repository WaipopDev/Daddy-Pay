import React from "react";
import { useAppSelector } from "@/store/hook";
import { Row } from "react-bootstrap";
import InputForm from "../FormGroup/inputForm";
import DropdownForm from "../FormGroup/dropdownForm";
import UploadFileForm from "../FormGroup/uploadFileForm";

const ShopInfoForm = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }

    return (
        <div className="text-sm">
            <div className="flex border-b border-gray-300">
                <p className="bg-[#F2F2F2] p-2 font-bold">{lang['page_shop_info_shop_info']}</p>
            </div>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_shop_code']}
                    placeholder={lang['page_shop_info_shop_code']}
                    name="shopCode"
                    required
                />
                <InputForm
                    label={lang['page_shop_info_shop_name']}
                    placeholder={lang['page_shop_info_shop_name']}
                    name="shopName"
                    required
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_shop_address']}
                    placeholder={lang['page_shop_info_shop_address']}
                    name="shopAddress"
                />
                <InputForm
                    label={lang['page_shop_info_contact_info']}
                    placeholder={lang['page_shop_info_contact_info']}
                    name="shopContactInfo"
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_mobile_phone']}
                    placeholder={lang['page_shop_info_mobile_phone']}
                    name="shopMobilePhone"
                />
                <InputForm
                    label={lang['page_shop_info_email']}
                    placeholder={lang['page_shop_info_email']}
                    name="shopEmail"
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_latitude']}
                    placeholder={lang['page_shop_info_latitude']}
                    name="shopLatitude"
                />
                <InputForm
                    label={lang['page_shop_info_longitude']}
                    placeholder={lang['page_shop_info_longitude']}
                    name="shopLongitude"
                />
            </Row>
            <Row className="pt-2">
                <DropdownForm
                    label={lang['global_status']}
                    placeholder={lang['global_status']}
                    name="shopStatus"
                    required
                    items={[
                        { label: lang['global_active'], value: 'Active' },
                        { label: lang['global_inactive'], value: 'Inactive' }
                    ]}
                />
                <InputForm
                    label={lang['page_shop_info_system_name']}
                    placeholder={lang['page_shop_info_system_name']}
                    name="shopSystemName"
                    required
                />
            </Row>
            <Row className="pt-2">
                <div className="col-6">
                    <UploadFileForm
                        label={lang['global_logo']}
                        placeholder={lang['global_logo']}
                        name="shopUploadFile"
                        required
                    />
                </div>
            </Row>
            <div className="flex border-b border-gray-300 pt-1">
                <p className="bg-[#F2F2F2] p-2 font-bold">{lang['page_shop_info_tax_invoice']}</p>
            </div>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_tax_name']}
                    placeholder={lang['page_shop_info_tax_name']}
                    name="shopTaxName"
                />
                <InputForm
                    label={lang['page_shop_info_tax_id']}
                    placeholder={lang['page_shop_info_tax_id']}
                    name="shopTaxId"
                />
            </Row>
            <Row className="pt-2">
                <div className="col-6">
                    <InputForm
                        label={lang['page_shop_info_tax_address']}
                        placeholder={lang['page_shop_info_tax_address']}
                        name="shopTaxAddress"
                    />
                </div>
            </Row>
            <div className="flex border-b border-gray-300 pt-1">
                <p className="bg-[#F2F2F2] p-2 font-bold">{lang['page_shop_info_bank_information']}</p>
            </div>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_bank_account']}
                    placeholder={lang['page_shop_info_bank_account']}
                    name="shopBankAccount"
                    required
                />
                <InputForm
                    label={lang['page_shop_info_bank_account_number']}
                    placeholder={lang['page_shop_info_bank_account_number']}
                    name="shopBankAccountNumber"
                    required
                />
            </Row>
            <Row className="pt-2">
                <InputForm
                    label={lang['page_shop_info_bank_name']}
                    placeholder={lang['page_shop_info_bank_name']}
                    name="shopBankName"
                    required
                />
                <InputForm
                    label={lang['page_shop_info_bank_branch']}
                    placeholder={lang['page_shop_info_bank_branch']}
                    name="shopBankBranch"
                    required
                />
            </Row>
        </div>
    )
}

export default ShopInfoForm