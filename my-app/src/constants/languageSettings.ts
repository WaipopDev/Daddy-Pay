export const LANGUAGE_SETTINGS_API = {
    LIST: '/api/lang/list',
    BY_CODE: (langCode: string) => `/api/lang?langCode=${langCode}`,
    SAVE: '/api/lang/save',
    BY_CODE_MUTATE: (langCode: string) => `/api/lang/${encodeURIComponent(langCode)}`,
} as const;
