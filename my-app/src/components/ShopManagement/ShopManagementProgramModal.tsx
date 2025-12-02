import React, { useRef, useState, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import { ItemDataProps, defaultItemProgramDataProps } from '@/app/(appAuth)/shop-management/program/[keyId]/page';

export interface ShopManagementProgramFormData {
    machineProgramID: string;
    programPrice: string;
    programOperationTime: string;
}

interface ShopManagementProgramModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (data: ShopManagementProgramFormData) => Promise<void>;
    lang: { [key: string]: string };
    item: ItemDataProps | null;
    defaultItemProgram: defaultItemProgramDataProps[];
}

const ShopManagementProgramModal: React.FC<ShopManagementProgramModalProps> = ({
    show,
    handleClose,
    handleSave,
    lang,
    item,
    defaultItemProgram
}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [validated, setValidated] = useState(false);

    // Reset validation when modal opens/closes
    useEffect(() => {
        if (show) {
            setValidated(false);
        }
    }, [show]);

    const onSave = async () => {
        const form = formRef.current;
        if (!form) return;

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const machineProgramID = form['machineProgramID'].value;
        const programPrice = form['programPrice'].value;
        const programOperationTime = form['programOperationTime'].value;

        const data = {
            machineProgramID,
            programPrice,
            programOperationTime
        };

        await handleSave(data);
    };

    return (
        <ModalForm
            show={show}
            handleClose={handleClose}
            title={lang['page_shop_management_adding_program_price']}
            handleSave={onSave}
        >
            <Form noValidate validated={validated} ref={formRef} >
                {item && (
                    <>
                        <div className="flex pb-2">
                            <p className="basis-1/3 font-bold">{lang['page_shop_management_shop']}<span className="text-red-500">*</span> :</p>
                            <p>{item.shopInfo.shopName}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="basis-1/3 font-bold">{lang['page_machine_info_machine_type']}<span className="text-red-500">*</span> :</p>
                            <p>{item.machineInfo.machineType}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="basis-1/3 font-bold">{lang['page_machine_info_model']}<span className="text-red-500">*</span> :</p>
                            <p>{item.machineInfo.machineModel}</p>
                        </div>
                    </>
                )}
                <Col className="mb-2">
                    <DropdownForm
                        label={lang['page_shop_management_program']}
                        name="machineProgramID"
                        required
                        items={defaultItemProgram ? defaultItemProgram.map(program => ({
                            label: program.programName,
                            value: program.id
                        })) : []}
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['global_price']}
                        placeholder={lang['global_price']}
                        name="programPrice"
                        type="number"
                        required
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_shop_management_operation_time']}
                        placeholder={lang['page_shop_management_operation_time']}
                        name="programOperationTime"
                        type="number"
                        required
                    />
                </Col>
            </Form>
        </ModalForm>
    );
};

export default ShopManagementProgramModal;
