"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
};

const langSlice = createSlice({
    name: 'lang',
    initialState,
    reducers: {
        setLang: (state, action: PayloadAction<{[key: string]: string}>) => {
            const { payload } = action;
            return {
                ...state,
                ...payload
            }
        },
        clearPropsLang: () => {
            return initialState
        }
    }
});

export const { setLang, clearPropsLang } = langSlice.actions;
export default langSlice.reducer;
