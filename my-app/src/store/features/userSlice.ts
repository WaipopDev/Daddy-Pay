"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: UserAdmin = {
    birthDate   : null,
    department  : '',
    email       : '',
    firstName   : '',
    id          : 0,
    idCard      : '',
    lastName    : '',
    mobileNo    : '',
    orgAddress  : null,
    orgName     : null,
    orgShortName: null,
    orgType     : null,
    position    : '',
    prefixId    : 0,
    userAddress : null,
    username    : '',
    permissions : []
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
