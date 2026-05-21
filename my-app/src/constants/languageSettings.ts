export const LANGUAGE_SETTINGS_API = {
    LIST: '/api/lang/list',
    BY_CODE: (langCode: string) => `/api/lang?langCode=${langCode}`,
    SAVE: '/api/lang/save',
} as const;
