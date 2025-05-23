"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: UserAdmin = {
    id: 0,
    username: '',
    email: '',
    role: '',
    active: false,
    subscribe: false,
    isVerified: false,
    isAdminLevel: 0,
    subscribeStartDate: null,
    subscribeEndDate: null,
    createdAt: '',
    updatedAt: '',
    createdBy: 0,
    updatedBy: 0
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPropsUser: (state, action: PayloadAction<UserAdmin>) => {
            Object.assign(state, action.payload);
        },
        clearPropsUser: () => {
            return initialState
        }
    }
});

export const { setPropsUser, clearPropsUser } = userSlice.actions;
export default userSlice.reducer;
