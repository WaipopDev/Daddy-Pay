export type TranslationsMap = Record<string, string>;

export type LangListMap = Record<string, string>;

export interface LanguageAddFormErrors {
    langCode?: string;
    langName?: string;
}

export interface LanguageSavePayload {
    langCode: string;
    langName: string;
    translations: TranslationsMap;
}

export interface LanguageAddFormState {
    langCode: string;
    langName: string;
    translations: TranslationsMap;
    errors: LanguageAddFormErrors;
}
