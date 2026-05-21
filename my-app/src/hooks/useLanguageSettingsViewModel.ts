'use client';

import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { openModalAlert, setProcess } from '@/store/features/modalSlice';
import { getDefaultTranslations } from '@/lib/languageDefaultTranslations';
import {
    fetchLanguageByCode,
    fetchLanguageList,
    saveLanguage,
} from '@/services/languageSettingsService';
import { validateLanguageAddForm } from '@/utils/languageSettingsValidation';
import type { LangListMap, TranslationsMap } from '@/types/languageSettingsType';

const EMPTY_FORM = {
    langCode: '',
    langName: '',
    translations: {} as TranslationsMap,
    errors: {},
};

export const useLanguageSettingsViewModel = () => {
    const dispatch = useAppDispatch();
    const lang = useAppSelector((state) => state.lang) as Record<string, string>;

    const [langList, setLangList] = useState<LangListMap>({});
    const [langActive, setLangActive] = useState<TranslationsMap>({});
    const [activeTabKey, setActiveTabKey] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const loadTranslations = useCallback(async (code: string) => {
        const data = await fetchLanguageByCode(code);
        setLangActive(data);
    }, []);

    const refreshLanguageList = useCallback(async (selectCode?: string) => {
        const list = await fetchLanguageList();
        setLangList(list);
        const keys = Object.keys(list);
        if (keys.length === 0) return list;

        const code = selectCode && list[selectCode] !== undefined ? selectCode : keys[0];
        setActiveTabKey(code);
        await loadTranslations(code);
        return list;
    }, [loadTranslations]);

    useEffect(() => {
        refreshLanguageList().catch((error) => {
            console.error('Error fetching language list:', error);
        });
    }, [refreshLanguageList]);

    const handleTabChange = useCallback(
        async (key: string | null) => {
            if (!key) return;
            setActiveTabKey(key);
            try {
                await loadTranslations(key);
            } catch (error) {
                console.error('Error fetching language tab:', error);
            }
        },
        [loadTranslations]
    );

    const openAddModal = useCallback(() => {
        setForm({
            langCode: '',
            langName: '',
            translations: getDefaultTranslations(),
            errors: {},
        });
        setShowAddModal(true);
    }, []);

    const closeAddModal = useCallback(() => {
        setShowAddModal(false);
        setForm(EMPTY_FORM);
    }, []);

    const setLangCode = useCallback((value: string) => {
        setForm((prev) => ({
            ...prev,
            langCode: value,
            errors: { ...prev.errors, langCode: undefined },
        }));
    }, []);

    const setLangName = useCallback((value: string) => {
        setForm((prev) => ({
            ...prev,
            langName: value,
            errors: { ...prev.errors, langName: undefined },
        }));
    }, []);

    const setTranslationValue = useCallback((key: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            translations: { ...prev.translations, [key]: value },
        }));
    }, []);

    const saveNewLanguage = useCallback(async () => {
        const errors = validateLanguageAddForm(form.langCode, form.langName, {
            langCodeRequired: lang['page_language_settings_lang_code_required'],
            langNameRequired: lang['page_language_settings_lang_name_required'],
        });

        if (Object.keys(errors).length > 0) {
            setForm((prev) => ({ ...prev, errors }));
            return;
        }

        const payload = {
            langCode: form.langCode.trim().toUpperCase(),
            langName: form.langName.trim(),
            translations: form.translations,
        };

        dispatch(setProcess(true));
        try {
            await saveLanguage(payload);
            closeAddModal();
            window.location.reload();
            return;
        } catch (error) {
            const err = error as AxiosError;
            const errorMessage =
                (err.response?.data as { message?: string })?.message ||
                lang['global_error_message'];
            dispatch(openModalAlert({ message: errorMessage, title: lang['global_error'] }));
        } finally {
            dispatch(setProcess(false));
        }
    }, [closeAddModal, dispatch, form, lang]);

    return {
        lang,
        langList,
        langActive,
        activeTabKey,
        showAddModal,
        form,
        handleTabChange,
        openAddModal,
        closeAddModal,
        setLangCode,
        setLangName,
        setTranslationValue,
        saveNewLanguage,
    };
};
