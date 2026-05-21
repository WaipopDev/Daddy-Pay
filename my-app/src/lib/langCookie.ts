import Cookies from 'js-cookie';
import { LANGUAGE_DEFAULT_CODE, normalizeLangCode } from '@/constants/languageSettings';

export { normalizeLangCode } from '@/constants/languageSettings';

export const LANG_COOKIE_OPTIONS = { path: '/', expires: 30 } as const;

/** Read `lang` cookie in the browser; default EN and re-write cookie if missing/invalid */
export const getClientLangCode = (): string => {
    const raw = Cookies.get('lang');
    const code = normalizeLangCode(raw);
    if (raw !== code) {
        Cookies.set('lang', code, LANG_COOKIE_OPTIONS);
    }
    return code;
};

export const setClientLangCookie = (langCode: string): string => {
    const code = normalizeLangCode(langCode);
    Cookies.set('lang', code, LANG_COOKIE_OPTIONS);
    return code;
};
