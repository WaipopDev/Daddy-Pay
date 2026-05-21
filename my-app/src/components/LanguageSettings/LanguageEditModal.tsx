'use client';

import React from 'react';
import { Form, Table } from 'react-bootstrap';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import type { LanguageAddFormState } from '@/types/languageSettingsType';

interface LanguageEditModalProps {
    show: boolean;
    title: string;
    labels: Record<string, string>;
    form: LanguageAddFormState;
    onClose: () => void;
    onSave: () => void;
    onLangNameChange: (value: string) => void;
    onTranslationChange: (key: string, value: string) => void;
}

const LanguageEditModal: React.FC<LanguageEditModalProps> = ({
    show,
    title,
    labels,
    form,
    onClose,
    onSave,
    onLangNameChange,
    onTranslationChange,
}) => (
    <ModalForm show={show} handleClose={onClose} title={title} handleSave={onSave} size="lg">
        <div className="flex flex-col gap-3">
            <Form.Group className="flex items-center">
                <Form.Label className="basis-1/3 font-bold m-0">
                    {labels.langCode} :
                </Form.Label>
                <div className="basis-2/3">
                    <Form.Control
                        type="text"
                        value={form.langCode}
                        disabled
                        className="text-sm bg-light"
                    />
                </div>
            </Form.Group>
            <InputForm
                label={labels.langName}
                placeholder={labels.langNamePlaceholder}
                value={form.langName}
                onChange={(e) => onLangNameChange(e.target.value)}
                required
                isInvalid={!!form.errors.langName}
                errorMessage={form.errors.langName}
            />
            <div>
                <div className="border rounded max-h-[50vh] overflow-y-auto">
                    <Table striped bordered hover size="sm" className="mb-0">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th className="text-xs" style={{ width: '40%' }}>
                                    {labels.key}
                                </th>
                                <th className="text-xs">{labels.value}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(form.translations).map(([key, value]) => (
                                <tr key={key}>
                                    <td className="text-xs font-medium align-middle">{key}</td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            value={value}
                                            onChange={(e) =>
                                                onTranslationChange(key, e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    </ModalForm>
);

export default LanguageEditModal;
