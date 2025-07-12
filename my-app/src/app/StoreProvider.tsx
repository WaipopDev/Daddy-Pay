'use client'
import { useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from "react";
import { Provider } from 'react-redux'
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore, AppStore } from '@/store/store'
import Cookies from 'js-cookie'
import { setLang } from '@/store/features/langSlice';
import axios from 'axios';
import languageDefault from '../../languageDefault.json';
// import { setPrefix, setPermission } from '@/store/features/masterSlice'

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const storeRef = useRef<AppStore | null>(null)

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }
    const getLangFromAPI = useCallback(async () => {
        try {
            const store = storeRef.current
            if (!store) return;
            const langState = store.getState().lang;
            const hasLang = langState && Object.keys(langState).length > 0;
       
            if (!hasLang) {
                const langCode = Cookies.get('lang') || 'en'
                try {
                    const langData = await axios.get(`/api/lang?langCode=${langCode}`)
                    // if (langData.data) {
                    //     store.dispatch(setLang(langData.data))
                    // } else {
                        store.dispatch(setLang(languageDefault))
                    // }
                } catch (apiError) {
                    console.error("Failed to fetch language from API:", apiError)
                    store.dispatch(setLang(languageDefault))
                }
            }
        } catch (error) {
            console.error("Error in getLangFromAPI:", error)
            // Fallback to default language if there's an error
            if (storeRef.current) {
                storeRef.current.dispatch(setLang(languageDefault))
            }
        }
    }, [])

    useEffect(() => {
        if (storeRef.current) {
            const unsubscribe = setupListeners(storeRef.current.dispatch);
            getLangFromAPI()
            return () => {
                unsubscribe();
            };
        }
    }, [getLangFromAPI]);


    return <Provider store={storeRef.current}>{children}</Provider>
}