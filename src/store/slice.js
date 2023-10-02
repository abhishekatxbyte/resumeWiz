// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// const apiKey = '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';

// // Define the async thunk
// export const sendTextForExtraction = createAsyncThunk(
//     'extraction/sendTextForExtraction',
//     async (props) => {
//         const { userInput, enableCustom, customSchema } = props

//         try {
//             // Create prompt text with user input
//             console.log(enableCustom)
//             console.log(customSchema)
//             let schema = customSchema;
//             const prompt = `return a json for ${userInput}`;


//             const requestData = {
//                 model: "gpt-3.5-turbo",
//                 messages: [
//                     { role: "system", "content": "You are a helpful assistant." },
//                     { role: "user", content: prompt }
//                 ],
//                 functions: [{ name: "set_user_data", parameters: schema }],
//                 function_call: { name: "set_user_data" },
//             };

//             // Send the request to the OpenAI API
//             const response = await axios.post(
//                 'https://api.openai.com/v1/chat/completions',
//                 requestData,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${apiKey}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             const generatedText = response.data.choices[0].message.function_call.arguments;
//             return generatedText;
//         } catch (error) {
//             throw error;
//         }
//     }
// );

// const extractionSlice = createSlice({
//     name: 'extraction',
//     initialState: {
//         outputData: null,
//         loading: false,
//         error: null,
//         enableAi: false,
//         enableCustom: null,
//         pdfFile: null,
//         customSchema: null
//     },
//     reducers: {
//         ADD_DATA(state, action) {
//             state.outputData = action.payload;
//         },
//         ADD_FILE(state, action) {
//             state.pdfFile = action.payload
//         },
//         REMOVE_DATA(state) {
//             state.outputData = null;
//         },
//         ENABLE_AI(state, action) {
//             state.enableAi = action.payload;
//         },
//         SET_LOADING(state, action) {
//             state.loading = action.payload
//         },
//         ENABLE_CUSTOM(state, action) {
//             state.enableCustom = action.payload;
//         },
//         SET_CUSTOM_SCHEMA(state, action) {
//             state.customSchema = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(sendTextForExtraction.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(sendTextForExtraction.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.outputData = action.payload;
//             })
//             .addCase(sendTextForExtraction.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message; // You can handle the error message here
//             });
//     },
// });


// export const { ADD_DATA, ENABLE_AI, REMOVE_DATA, ADD_FILE, SET_LOADING, ENABLE_CUSTOM, SET_CUSTOM_SCHEMA } = extractionSlice.actions
// export const outputData = (state => state.extraction.outputData)
// export const loading = (state => state.extraction.loading)
// export const ai_status = state => state.extraction.enableAi
// export const EnableCustom = state => state.extraction.enableCustom
// export const CustomSchema = state => state.extraction.customSchema

// export const inputFile = state => state.extraction.pdfFile

// export default extractionSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiKey = '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';

// Define the async thunk
export const sendTextForExtraction = createAsyncThunk(
    'extraction/sendTextForExtraction',
    async (props) => {
        const { userInput, enableCustom, customSchema } = props

        try {
            // Create prompt text with user input
            console.log(enableCustom)
            console.log(customSchema)
            let schema = customSchema;
            const prompt = `return a json for ${userInput}`;


            const requestData = {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", "content": "You are a helpful assistant." },
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
        multipleData: [],
        outputData: null,
        loading: false,
        error: null,
        enableAi: false,
        enableCustom: null,
        pdfFile: null,
        customSchema: null
    },
    reducers: {
        ADD_MULTIPLE_DATA(state, action) {
            state.multipleData.push(action.payload)
        },
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
        },
        ENABLE_CUSTOM(state, action) {
            state.enableCustom = action.payload;
        },
        SET_CUSTOM_SCHEMA(state, action) {
            state.customSchema = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendTextForExtraction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendTextForExtraction.fulfilled, (state, action) => {
                state.loading = false;
                state.outputData = JSON.parse(action.payload);
            })
            .addCase(sendTextForExtraction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // You can handle the error message here
            });
    },
});


export const { ADD_DATA, ENABLE_AI, REMOVE_DATA, ADD_FILE, SET_LOADING, ENABLE_CUSTOM, SET_CUSTOM_SCHEMA, ADD_MULTIPLE_DATA } = extractionSlice.actions
export const outputData = (state => state.extraction.outputData)
export const loading = (state => state.extraction.loading)
export const ai_status = state => state.extraction.enableAi
export const EnableCustom = state => state.extraction.enableCustom
export const CustomSchema = state => state.extraction.customSchema
export const MultipleData = state => state.extraction.multipleData

export const inputFile = state => state.extraction.pdfFile

export default extractionSlice.reducer;






