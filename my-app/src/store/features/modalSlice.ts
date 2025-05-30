"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "@/types/modalType";

interface AlertState {
    alert: Alert,
    process: boolean
}

const initialState: AlertState = {
    alert: {
        show        : false,
        title       : '',
        message     : '',
        redirectTo  : '',
        callbackPath: '',
    },
    process: false
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModalAlert: (state, action: PayloadAction<Alert>) => {
            state.alert = {
                ...state.alert,
                ...action.payload,
                show      : true
            }
        },
        setProcess: (state, action: PayloadAction<boolean>) => {
            state.process = action.payload
        },
        closeModalAlert: () => {
            return initialState
        }
    }
});

export const { openModalAlert, closeModalAlert, setProcess } = modalSlice.actions;
export default modalSlice.reducer;
