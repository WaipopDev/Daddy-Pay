import React, { useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import DropdownForm from '@/components/FormGroup/dropdownForm';
import _ from 'lodash';
import validateRequiredFields from '@/utils/validateRequiredFields';
import { useAppDispatch } from '@/store/hook';
import { openModalAlert } from '@/store/features/modalSlice';

interface MachineDataProps {
    id: string;
    machineKey: string;
    machineType: string;
    machineBrand: string;
    machineModel: string;
}

interface ItemDataProps {
    id: string;
    programKey: string;
    programName: string;
    programDescription: string;
    machineInfo: {
        id: string;
        machineKey: string;
        machineType: string;
        machineBrand: string;
        machineModel: string;
        machineDescription: string;
        machinePicturePath: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProgramFormData {
    machineType: string;
    machineBrand: string;
    programName: string;
    programDescription: string;
}

interface ProgramModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (data: ProgramFormData) => Promise<void>;
    itemMachine: MachineDataProps[][] | null;
    lang: { [key: string]: string };
    editData: ItemDataProps | null;
}

const ProgramModal: React.FC<ProgramModalProps> = ({ show, handleClose, handleSave, itemMachine, lang, editData }) => {
    const dispatch = useAppDispatch();
    const formRef = useRef<HTMLFormElement>(null);
    const [validated, setValidated] = useState(false);
    const [activeMachineType, setActiveMachineType] = useState('');

    // Form states
    const [machineType, setMachineType] = useState('');
    const [machineBrand, setMachineBrand] = useState('');
    const [programName, setProgramName] = useState('');
    const [programDescription, setProgramDescription] = useState('');

    useEffect(() => {
        if (show) {
            if (editData) {
                // Pre-fill for edit
                const mId = editData.machineInfo?.id || '';
                const mKey = editData.machineInfo?.machineKey || '';
                let typeIndex = '';
                let foundMachineId = '';

                if (itemMachine) {
                    // Find the group containing this machine ID or Key
                    _.forEach(itemMachine, (group, index) => {
                        // Try to find by ID first
                        let found = group.find(m => m.id === mId);

                        // If not found by ID, try by Key
                        if (!found && mKey) {
                            found = group.find(m => m.machineKey === mKey);
                        }

                        if (found) {
                            typeIndex = index.toString();
                            foundMachineId = found.id;
                            return false; // break
                        }
                    });
                }

                // Fallback to type matching if not found
                if (!typeIndex && editData.machineInfo?.machineType && itemMachine) {
                    const mType = editData.machineInfo.machineType;
                    _.forEach(itemMachine, (group, index) => {
                        if (group[0].machineType === mType) {
                            typeIndex = index.toString();
                            return false; // break
                        }
                    });
                }

                setMachineType(typeIndex);
                setActiveMachineType(typeIndex);
                // Use the found machine ID if available, otherwise fallback to the ID from editData (which might be wrong but it's all we have)
                setMachineBrand(foundMachineId || mId);
                setProgramName(editData.programName);
                setProgramDescription(editData.programDescription);
            } else {
                // Reset for add
                setMachineType('');
                setActiveMachineType('');
                setMachineBrand('');
                setProgramName('');
                setProgramDescription('');
            }
            setValidated(false);
        }
    }, [show, editData, itemMachine]);

    const onSave = async () => {
        const form = formRef.current;
        if (!form) return;

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const message = validateRequiredFields([
            { value: machineType, label: lang['page_machine_info_machine_type'] },
            { value: machineBrand, label: lang['page_machine_info_brand'] },
            { value: programName, label: lang['page_program_info_program_code'] },
        ]);

        if (message) {
            dispatch(openModalAlert({ message: `${lang['global_required_fields']}<br/>${message}` }));
            return;
        }

        const data = {
            machineType,
            machineBrand,
            programName,
            programDescription
        };

        await handleSave(data);
    };
    return (
        <ModalForm
            show={show}
            handleClose={handleClose}
            title={editData ? lang['page_program_info_edit_program'] : lang['page_program_info_add_program']}
            handleSave={onSave}
        >
            <Form noValidate validated={validated} ref={formRef}>
                <Col className="mb-2">
                    <DropdownForm
                        key={machineType} // Force re-render when value changes to update defaultValue
                        label={lang['page_machine_info_machine_type']}
                        name="machineType"
                        required
                        items={itemMachine ? _.map(itemMachine, (machine, index) => ({
                            label: machine[0].machineType,
                            value: index.toString()
                        })) : []}
                        onChange={(value) => {
                            setMachineType(value);
                            setActiveMachineType(value);
                            setMachineBrand('');
                        }}
                        defaultValue={machineType}
                        disabled={!!editData}
                    />
                </Col>
                <Col className="mb-2">
                    <DropdownForm
                        key={`${machineBrand}-${activeMachineType}`}
                        label={lang['page_machine_info_brand']}
                        name="machineBrand"
                        required
                        items={itemMachine && activeMachineType !== '' ? itemMachine[Number(activeMachineType)].map(machine => ({
                            label: `${machine.machineBrand} - ${machine.machineModel}`,
                            value: machine.id.toString()
                        })) : []}
                        disabled={!activeMachineType || !!editData}
                        onChange={(value) => setMachineBrand(value)}
                        defaultValue={machineBrand}
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_program_info_program_code']}
                        placeholder={lang['page_program_info_program_code']}
                        name="programName"
                        required
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                    />
                </Col>
                <Col className="mb-2">
                    <InputForm
                        label={lang['page_program_info_description']}
                        placeholder={lang['page_program_info_description']}
                        name="programDescription"
                        value={programDescription}
                        onChange={(e) => setProgramDescription(e.target.value)}
                    />
                </Col>
            </Form>
        </ModalForm>
    );
};

export default ProgramModal;
