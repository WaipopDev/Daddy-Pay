'use client';

import React from 'react';
import { LanguageSettingsView } from '@/components/LanguageSettings';
import { useLanguageSettingsViewModel } from '@/hooks/useLanguageSettingsViewModel';

const LanguageSettingsPage = () => {
    const vm = useLanguageSettingsViewModel();
    return <LanguageSettingsView vm={vm} />;
};

export default LanguageSettingsPage;
