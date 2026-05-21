'use client';

import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import _ from 'lodash';
import LanguageSettingsTabPanel from './LanguageSettingsTabPanel';
import type { LangListMap, TranslationsMap } from '@/types/languageSettingsType';

interface LanguageSettingsTabsProps {
    langList: LangListMap;
    activeTabKey: string;
    activeTranslations: TranslationsMap;
    labels: Record<string, string>;
    onTabChange: (key: string | null) => void;
    onEdit: (langCode: string) => void;
    onDelete: (langCode: string) => void;
}

const LanguageSettingsTabs: React.FC<LanguageSettingsTabsProps> = ({
    langList,
    activeTabKey,
    activeTranslations,
    labels,
    onTabChange,
    onEdit,
    onDelete,
}) => {
    const keys = Object.keys(langList);
    if (keys.length === 0) return null;

    return (
        <Tabs
            activeKey={activeTabKey || keys[0]}
            className="mb-3"
            onSelect={onTabChange}
        >
            {_.map(langList, (langName, code) => (
                <Tab key={code} eventKey={code} title={langName}>
                    <LanguageSettingsTabPanel
                        langCode={code}
                        labels={labels}
                        translations={activeTabKey === code ? activeTranslations : {}}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Tab>
            ))}
        </Tabs>
    );
};

export default LanguageSettingsTabs;
