import languageDefault from '../../languageDefault.json';
import type { TranslationsMap } from '@/types/languageSettingsType';

export const getDefaultTranslations = (): TranslationsMap => ({
    ...(languageDefault as TranslationsMap),
});
