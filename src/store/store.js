import { configureStore } from '@reduxjs/toolkit'
import extractionSlice from './slice'

export const store = configureStore({
    reducer: {
        extraction: extractionSlice,
    },
})
