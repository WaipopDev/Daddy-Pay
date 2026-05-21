import type { LanguageAddFormErrors } from '@/types/languageSettingsType';

export const validateLanguageAddForm = (
    langCode: string,
    langName: string,
    messages: { langCodeRequired: string; langNameRequired: string }
): LanguageAddFormErrors => {
    const errors: LanguageAddFormErrors = {};
    if (!langCode.trim()) {
        errors.langCode = messages.langCodeRequired;
    }
    if (!langName.trim()) {
        errors.langName = messages.langNameRequired;
    }
    return errors;
};

export const validateLanguageEditForm = (
    langName: string,
    messages: { langNameRequired: string }
): Pick<LanguageAddFormErrors, 'langName'> => {
    const errors: Pick<LanguageAddFormErrors, 'langName'> = {};
    if (!langName.trim()) {
        errors.langName = messages.langNameRequired;
    }
    return errors;
};
