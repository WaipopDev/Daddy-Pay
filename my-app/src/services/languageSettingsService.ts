import axios from 'axios';
import { LANGUAGE_SETTINGS_API } from '@/constants/languageSettings';
import type {
    LangListMap,
    LanguageSavePayload,
    LanguageUpdatePayload,
    TranslationsMap,
} from '@/types/languageSettingsType';

export const fetchLanguageList = async (): Promise<LangListMap> => {
    const response = await axios.get(LANGUAGE_SETTINGS_API.LIST);
    return (response.data || {}) as LangListMap;
};

export const fetchLanguageByCode = async (langCode: string): Promise<TranslationsMap> => {
    const response = await axios.get(LANGUAGE_SETTINGS_API.BY_CODE(langCode));
    return (response.data || {}) as TranslationsMap;
};

export const saveLanguage = async (payload: LanguageSavePayload) => {
    return axios.post(LANGUAGE_SETTINGS_API.SAVE, payload);
};

export const updateLanguage = async (langCode: string, payload: LanguageUpdatePayload) => {
    return axios.patch(LANGUAGE_SETTINGS_API.BY_CODE_MUTATE(langCode), payload);
};

export const deleteLanguage = async (langCode: string) => {
    return axios.delete(LANGUAGE_SETTINGS_API.BY_CODE_MUTATE(langCode));
};
