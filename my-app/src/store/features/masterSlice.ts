"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MasterData = {
    prefix: [],
    permission: []
};

const masterSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {
        setPrefix: (state, action: PayloadAction<{prefix:PrefixProps[]}>) => {
            Object.assign(state, action.payload);
        },
        setPermission: (state, action: PayloadAction<{permission:PermissionProps[]}>) => {
            Object.assign(state, action.payload);
        },
        clearPropsMaster: () => {
            return initialState
        }
    }
});

export const { setPrefix, setPermission, clearPropsMaster } = masterSlice.actions;
export default masterSlice.reducer;
