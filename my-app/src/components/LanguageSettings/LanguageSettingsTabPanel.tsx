'use client';

import React from 'react';
import { Button } from 'react-bootstrap';
import LanguageTranslationsTable from './LanguageTranslationsTable';
import { isLanguageDeletable } from '@/constants/languageSettings';
import type { TranslationsMap } from '@/types/languageSettingsType';

interface LanguageSettingsTabPanelProps {
    langCode: string;
    labels: Record<string, string>;
    translations: TranslationsMap;
    onEdit: (langCode: string) => void;
    onDelete: (langCode: string) => void;
}

const LanguageSettingsTabPanel: React.FC<LanguageSettingsTabPanelProps> = ({
    langCode,
    labels,
    translations,
    onEdit,
    onDelete,
}) => {
    const canDelete = isLanguageDeletable(langCode);

    return (
    <>
        <div className="flex flex-col md:flex-row justify-end pb-2 mb-4 gap-2">
            <Button
                variant="primary"
                className="w-full md:w-auto"
                onClick={() => onEdit(langCode)}
            >
                {labels.editLanguage}
            </Button>
            {canDelete && (
                <Button
                    variant="danger"
                    className="w-full md:w-auto"
                    onClick={() => onDelete(langCode)}
                >
                    {labels.deleteLanguage}
                </Button>
            )}
        </div>
        <LanguageTranslationsTable
            labels={{
                key: labels.key,
                value: labels.value,
                noData: labels.noData,
            }}
            translations={translations}
        />
    </>
    );
};

export default LanguageSettingsTabPanel;
