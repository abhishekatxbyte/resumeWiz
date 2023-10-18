import { configureStore } from '@reduxjs/toolkit'
import extractionSlice from './slice'
import userslice from './userslice'

export const store = configureStore({
    reducer: {
        extraction: extractionSlice,
        user: userslice
    },
})
