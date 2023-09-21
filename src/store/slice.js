import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiKey = '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';

// Define the async thunk
export const sendTextForExtraction = createAsyncThunk(
    'extraction/sendTextForExtraction',
    async (userInput) => {
        try {
            // Create prompt text with user input
            const prompt = `return a json for ${userInput}`;
            const schema = {
                "type": "object",
                "properties": {
                    "Profile": {
                        "type": "object",
                        "properties": {
                            "Name": {
                                "type": "string",
                                "description": "Descriptive name of person"
                            },
                            "Email": {
                                "type": "string",
                                "description": "Email of person"
                            },
                            "Phone": {
                                "type": "string",
                                "description": "Phone, contact, mobile, cell number of person"
                            }
                        },
                        "required": ["Name", "Email", "Phone"] // Add required fields if necessary
                    },
                    "Education": {
                        "type": "array",
                        "items": { "type": "string" }
                    },
                    "Experience": {
                        "type": "array",
                        "items": { "type": "string" }
                    },
                    "Skills": {
                        "type": "array",
                        "items": { "type": "string" }
                    },
                    "Projects": {
                        "type": "array",
                        "items": { "type": "string" }
                    },
                    "Interests": {
                        "type": "array",
                        "items": { "type": "string" }
                    }
                }
            };

            const requestData = {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", "content": "You are a helpful recipe assistant." },
                    { role: "user", content: prompt }
                ],
                functions: [{ name: "set_user_data", parameters: schema }],
                function_call: { name: "set_user_data" },
            };

            // Send the request to the OpenAI API
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedText = response.data.choices[0].message.function_call.arguments;
            return generatedText;
        } catch (error) {
            throw error;
        }
    }
);

const extractionSlice = createSlice({
    name: 'extraction',
    initialState: {
        outputData: null,
        loading: false,
        error: null,
        enableAi: false,
        pdfFile: null
    },
    reducers: {
        ADD_DATA(state, action) {
            state.outputData = action.payload;
        },
        ADD_FILE(state, action) {

            state.pdfFile = action.payload

        },
        REMOVE_DATA(state) {
            state.outputData = null;
        },
        ENABLE_AI(state, action) {
            state.enableAi = action.payload;
        },
        SET_LOADING(state, action) {
            state.loading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendTextForExtraction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendTextForExtraction.fulfilled, (state, action) => {
                state.loading = false;
                state.outputData = action.payload;
            })
            .addCase(sendTextForExtraction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // You can handle the error message here
            });
    },
});


export const { ADD_DATA, ENABLE_AI, REMOVE_DATA, ADD_FILE, SET_LOADING } = extractionSlice.actions
export const outputData = (state => state.extraction.outputData)
export const loading = (state => state.extraction.loading)
export const ai_status = state => state.extraction.enableAi
export const inputFile = state => state.extraction.pdfFile

export default extractionSlice.reducer;



