'use client';

import React from 'react';
import { Button } from 'react-bootstrap';
import LanguageTranslationsTable from './LanguageTranslationsTable';
import type { TranslationsMap } from '@/types/languageSettingsType';

interface LanguageSettingsTabPanelProps {
    labels: Record<string, string>;
    translations: TranslationsMap;
}

const LanguageSettingsTabPanel: React.FC<LanguageSettingsTabPanelProps> = ({
    labels,
    translations,
}) => (
    <>
        <div className="flex flex-col md:flex-row justify-end pb-2 mb-4 gap-2">
            <Button variant="primary" className="w-full md:w-auto">
                {labels.editLanguage}
            </Button>
            <Button variant="danger" className="w-full md:w-auto">
                {labels.deleteLanguage}
            </Button>
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

export default LanguageSettingsTabPanel;
