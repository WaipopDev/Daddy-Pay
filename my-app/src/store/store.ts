import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './features/modalSlice'
import userSlice from './features/userSlice'
import masterSlice from './features/masterSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            modal : modalSlice,
            user  : userSlice,
            master: masterSlice
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']