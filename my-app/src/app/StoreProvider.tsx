'use client'
import { useEffect, useRef } from 'react'
import type { ReactNode } from "react";
import { Provider } from 'react-redux'
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore, AppStore } from '@/store/store'
// import { setPrefix, setPermission } from '@/store/features/masterSlice'

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }
    // const getPrefixStore = useCallback(async () => {
    //     try {
    //         if (storeRef.current) {
    //             const stores = storeRef.current.getState()
    //             if (stores.master.prefix.length === 0) {
    //                 const resPrefix = await getPrefix()
    //                 storeRef.current.dispatch(setPrefix({
    //                     prefix: resPrefix
    //                 }))
    //             }
    //             if (stores.master.permission.length === 0) {
    //                 const resPermission = await getPermission()
    //                 storeRef.current.dispatch(setPermission({
    //                     permission: resPermission
    //                 }))
    //             }
    //         }
    //     } catch (error) {
    //         console.log("🚀 ~ getPrefix ~ error:", error)
    //     }
    // }, [])

    useEffect(() => {
        if (storeRef.current) {
            const unsubscribe = setupListeners(storeRef.current.dispatch);
            // getPrefixStore();
            return () => {
                unsubscribe();
            };
        }
    }, []);


    return <Provider store={storeRef.current}>{children}</Provider>
}