/** Default language — cannot be deleted */
export const LANGUAGE_DEFAULT_CODE = 'EN';

export const isLanguageDeletable = (langCode: string) =>
    langCode.trim().toUpperCase() !== LANGUAGE_DEFAULT_CODE;

/** Cookie/API value missing or empty → EN */
export const normalizeLangCode = (value?: string | null): string => {
    if (value === undefined || value === null) {
        return LANGUAGE_DEFAULT_CODE;
    }
    const trimmed = String(value).trim();
    if (!trimmed) {
        return LANGUAGE_DEFAULT_CODE;
    }
    return trimmed.toUpperCase();
};

export const LANGUAGE_SETTINGS_API = {
    LIST: '/api/lang/list',
    BY_CODE: (langCode: string) => `/api/lang?langCode=${langCode}`,
    SAVE: '/api/lang/save',
    BY_CODE_MUTATE: (langCode: string) => `/api/lang/${encodeURIComponent(langCode)}`,
} as const;
