'use client';

import React from 'react';
import { Form, Table } from 'react-bootstrap';
import ModalForm from '@/components/Modals/ModalForm';
import InputForm from '@/components/FormGroup/inputForm';
import type { LanguageAddFormState } from '@/types/languageSettingsType';

interface LanguageAddModalProps {
    show: boolean;
    title: string;
    labels: Record<string, string>;
    form: LanguageAddFormState;
    onClose: () => void;
    onSave: () => void;
    onLangCodeChange: (value: string) => void;
    onLangNameChange: (value: string) => void;
    onTranslationChange: (key: string, value: string) => void;
}

const LanguageAddModal: React.FC<LanguageAddModalProps> = ({
    show,
    title,
    labels,
    form,
    onClose,
    onSave,
    onLangCodeChange,
    onLangNameChange,
    onTranslationChange,
}) => (
    <ModalForm show={show} handleClose={onClose} title={title} handleSave={onSave} size="lg">
        <div className="flex flex-col gap-3">
            <InputForm
                label={labels.langCode}
                placeholder={labels.langCodePlaceholder}
                value={form.langCode}
                onChange={(e) => onLangCodeChange(e.target.value)}
                required
                isInvalid={!!form.errors.langCode}
                errorMessage={form.errors.langCode}
            />
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
                                <th className="text-xs" style={{ width: '40%' }}>{labels.key}</th>
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

export default LanguageAddModal;
