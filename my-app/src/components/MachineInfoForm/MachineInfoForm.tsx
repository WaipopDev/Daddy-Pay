import React from "react";
import { useAppSelector } from "@/store/hook";
import { Col, Form } from "react-bootstrap";
import InputForm from "../FormGroup/inputForm";
import UploadFileForm from "../FormGroup/uploadFileForm";
import { ItemMachineInfoDataProps } from "@/types/machineInfoType";
import Image from "next/image";

interface MachineInfoFormProps {
    item?: ItemMachineInfoDataProps | null;
    action?: 'add' | 'edit';
    formRef?: React.RefObject<HTMLFormElement | null>;
    validated?: boolean;
}

const MachineInfoForm: React.FC<MachineInfoFormProps> = ({ 
    item = null, 
    action = 'add',
    formRef,
    validated = false
}) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }

    return (
        <Form noValidate validated={validated} ref={formRef}>
            <Col className="mb-2">
                <InputForm
                    label={lang['page_machine_info_machine_type']}
                    placeholder={lang['page_machine_info_machine_type']}
                    name="machineType"
                    required
                    defaultValue={item?.machineType || ''}
                />
            </Col>
            <Col className="mb-2">
                <InputForm
                    label={lang['page_machine_info_brand']}
                    placeholder={lang['page_machine_info_brand']}
                    name="machineBrand"
                    required
                    defaultValue={item?.machineBrand || ''}
                />
            </Col>
            <Col className="mb-2">
                <InputForm
                    label={lang['page_machine_info_model']}
                    placeholder={lang['page_machine_info_model']}
                    name="machineModel"
                    required
                    defaultValue={item?.machineModel || ''}
                />
            </Col>
            <Col className="mb-2">
                <InputForm
                    label={lang['page_machine_info_description']}
                    placeholder={lang['page_machine_info_description']}
                    name="machineDescription"
                    defaultValue={item?.machineDescription || ''}
                />
            </Col>
            <Col className="mb-2">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <UploadFileForm
                            label={lang['page_machine_info_picture']}
                            placeholder={lang['page_machine_info_picture']}
                            name="machinePicture"
                            // required={action === 'add'}
                        />
                    </div>
                </div>
            </Col>
            <Col className="mb-2">
                <div className="flex gap-4">
                    {action === 'edit' && item?.machinePicturePath && (
                        <div className="flex items-center">
                            <Image 
                                src={item.machinePicturePath} 
                                alt={item.machineType} 
                                width={100} 
                                height={100} 
                                style={{ width: 'auto', height: 'auto' }} 
                                priority 
                            />
                        </div>
                    )}
                </div>
            </Col>
        </Form>
    );
};

export default MachineInfoForm;

