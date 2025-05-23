'use client'
import { useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from "react";
import { Provider } from 'react-redux'
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore, AppStore } from '@/store/store'
import Cookies from 'js-cookie'
import { setLang } from '@/store/features/langSlice';
import axios from 'axios';
// import { setPrefix, setPermission } from '@/store/features/masterSlice'

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }
    const getLangtore = useCallback(async () => {
        try {
            const store = storeRef.current
            if (!store) return;
            const langState = store.getState().lang;
            const hasLang = langState && Object.keys(langState).length > 0;
            if (!hasLang) {
                const langCode = Cookies.get('lang') || 'en'
                const langData = await axios.get(`/api/lang?langCode=${langCode}`)
                if (langData.data) {
                    store.dispatch(setLang(langData.data))
                }
            }
        } catch (error) {
            console.log("🚀 ~ getPrefix ~ error:", error)
        }
    }, [])

    useEffect(() => {
        if (storeRef.current) {
            const unsubscribe = setupListeners(storeRef.current.dispatch);
            
            getLangtore();
            return () => {
                unsubscribe();
            };
        }
    }, []);


    return <Provider store={storeRef.current}>{children}</Provider>
}