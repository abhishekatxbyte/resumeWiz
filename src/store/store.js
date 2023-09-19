import { configureStore } from '@reduxjs/toolkit'
import extractionSlice from './slice'

export const store = configureStore({
    reducer: {
        extraction: extractionSlice,
    },
})
const app = { "education": { "institution": "string", "degree": "string", "cgpa": "string", "cpi": "string", "spi": "string", "dates": "string" }, "undergraduate": ["string", "string", "string", "string", "string"], "links": [{ "type": "string", "link": "string" }, { "type": "string", "link": "string" }], "programming_skills": ["string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string"], "tools": ["string", "string", "string", "string", "string"], "experience": [{ "title": "string", "company": "string", "location": "string", "dates": "string", "description": ["string", "string", "string", "string"] }, { "title": "string", "company": "string", "location": "string", "dates": "string", "description": ["string", "string"] }, { "title": "string", "company": "string", "location": "string", "dates": "string", "description": ["string", "string"] }, { "title": "string", "company": "string", "location": "string", "dates": "string", "description": ["string", "string"] }, { "title": "string", "company": "string", "location": "string", "dates": "string", "description": ["string", "string"] }], "interests": ["string", "string", "string"] }