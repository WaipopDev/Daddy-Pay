'use client';

import React from 'react';
import LanguageSettingsToolbar from './LanguageSettingsToolbar';
import LanguageSettingsTabs from './LanguageSettingsTabs';
import LanguageAddModal from './LanguageAddModal';
import LanguageEditModal from './LanguageEditModal';
import ModalActionDelete from '@/components/Modals/ModalActionDelete';
import type { useLanguageSettingsViewModel } from '@/hooks/useLanguageSettingsViewModel';

type ViewModel = ReturnType<typeof useLanguageSettingsViewModel>;

interface LanguageSettingsViewProps {
    vm: ViewModel;
}

const LanguageSettingsView: React.FC<LanguageSettingsViewProps> = ({ vm }) => {
    const { lang } = vm;

    const tabLabels = {
        editLanguage: lang['button_edit_language'],
        deleteLanguage: lang['button_delete_language'],
        key: lang['page_language_settings_key'],
        value: lang['page_language_settings_value'],
        noData: lang['global_no_data'],
    };

    const modalLabels = {
        langCode: lang['page_language_settings_lang_code'],
        langCodePlaceholder: lang['page_language_settings_lang_code_placeholder'],
        langName: lang['page_language_settings_lang_name'],
        langNamePlaceholder: lang['page_language_settings_lang_name_placeholder'],
        translations: lang['page_language_settings_translations'],
        translationsHint: lang['page_language_settings_translations_hint'],
        key: lang['page_language_settings_key'],
        value: lang['page_language_settings_value'],
    };

    return (
        <main className="bg-white p-2 md:p-4">
            <LanguageSettingsToolbar
                addLabel={lang['button_add_language']}
                onAdd={vm.openAddModal}
            />

            <LanguageSettingsTabs
                langList={vm.langList}
                activeTabKey={vm.activeTabKey}
                activeTranslations={vm.langActive}
                labels={tabLabels}
                onTabChange={vm.handleTabChange}
                onEdit={vm.openEditModal}
                onDelete={vm.openDeleteModal}
            />

            <LanguageAddModal
                show={vm.showAddModal}
                title={lang['page_language_settings_add_title']}
                labels={modalLabels}
                form={vm.form}
                onClose={vm.closeAddModal}
                onSave={vm.saveNewLanguage}
                onLangCodeChange={vm.setLangCode}
                onLangNameChange={vm.setLangName}
                onTranslationChange={vm.setTranslationValue}
            />

            <LanguageEditModal
                show={vm.showEditModal}
                title={lang['page_language_settings_edit_title']}
                labels={modalLabels}
                form={vm.form}
                onClose={vm.closeEditModal}
                onSave={vm.updateExistingLanguage}
                onLangNameChange={vm.setLangName}
                onTranslationChange={vm.setTranslationValue}
            />

            <ModalActionDelete
                show={vm.showDeleteModal}
                handleClose={vm.closeDeleteModal}
                title={lang['page_language_settings_deleting']}
                text={lang['global_delete_confirmation']}
                id={vm.deleteLangCode}
                handleConfirm={vm.confirmDeleteLanguage}
            />
        </main>
    );
};

export default LanguageSettingsView;
