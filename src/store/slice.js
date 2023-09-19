import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

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
                    "Name": {
                        "type": "string",
                        "description": "Descriptive name of person"
                    },
                    "Email": {
                        "type": "string",
                        "description": "email of person"
                    }, "Phone": {
                        "type": "string",
                        "description": "Phone,contact,mobile,cell number of person"
                    },
                    "Experience": {
                        "type": "array",
                        "items": { "type": "string" }
                    }, "Education": {
                        "type": "array",
                        "items": { "type": "string" }
                    }, "Skills": {
                        "type": "array",
                        "items": { "type": "string" }
                    }, "Projects": {
                        "type": "array",
                        "items": { "type": "string" }
                    }, "Interests": {
                        "type": "array",
                        "items": { "type": "string" }
                    },

                }
            }
            const requestData = {
                model: "gpt-3.5-turbo-0613",
                messages: [
                    { role: "system", "content": "You are a helpful recipe assistant." },
                    { role: "user", content: prompt }
                ],
                functions: [{ name: "set_user_data", parameters: schema }],
                function_call: { name: "set_user_data" }
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
    },
    reducers: {
        ADD_DATA(state, action) {
            state.outputData = action.payload;
        },
        REMOVE_DATA(state) {
            state.outputData = null;
        },
        ENABLE_AI(state, action) {
            state.enableAi = action.payload;
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


export const { ADD_DATA, ENABLE_AI, REMOVE_DATA } = extractionSlice.actions
export const outputData = (state => state.extraction.outputData)
export const loading = (state => state.extraction.loading)
export const ai_status = state => state.extraction.enableAi
export default extractionSlice.reducer;




// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// export const sendTextForExtraction = createAsyncThunk(
//     'extraction/sendText',
//     async (inputText) => {
//         const options = {
//             method: 'POST',
//             url: 'https://ai-textraction.p.rapidapi.com/textraction',
//             headers: {
//                 'content-type': 'application/json',
//                 'X-RapidAPI-Key': '0bfb845ed4msh799c76abdf669d0p19055djsna6de42ee53ea',
//                 'X-RapidAPI-Host': 'ai-textraction.p.rapidapi.com'
//             },
//             data: {
//                 text: inputText,
//                 entities: [
//                     {
//                         var_name: 'personal_details',
//                         type: 'string',
//                         description: 'Full name,Phone number,Email of the person'
//                     },

//                     {
//                         var_name: 'education',
//                         type: 'array[string]',
//                         description: 'Educational background'
//                     },
//                     {
//                         var_name: 'programming_skills',
//                         type: 'array[string]',
//                         description: 'List of programming skills'
//                     },
//                     {
//                         var_name: 'experience',
//                         type: 'array[string]',
//                         description: 'Work experience details'
//                     },

//                     {
//                         var_name: 'interests',
//                         type: 'array[string]',
//                         description: 'Hobbies and interests'
//                     },
//                     {
//                         var_name: 'location',
//                         type: 'array[string]',
//                         description: 'Current location'
//                     },
//                     {
//                         var_name: 'social_media',
//                         type: 'array[string]',
//                         description: 'social media account profile Url'
//                     },
//                     {
//                         var_name: 'internship_details',
//                         type: 'array[string]',
//                         description: 'Details of internships'
//                     },
//                     {
//                         var_name: 'project_details',
//                         type: 'array[string]',
//                         description: 'Details of projects'
//                     }
//                 ]
//             },
//         };

//         try {
//             const response = await axios.request(options);




//             return response.data.results;
//         } catch (error) {
//             // Use rejectWithValue to pass the error message to the state
//             throw new Error(error.message)
//         }
//     }
// );
// const extractionSlice = createSlice({
//     name: 'extraction',
//     initialState: {
//         outputText: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         ADD_DATA(state, action) {
//             console.log(action.payload)
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(sendTextForExtraction.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(sendTextForExtraction.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.outputText = action.payload;
//             })
//             .addCase(sendTextForExtraction.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     },
// });
// export const { ADD_DATA } = extractionSlice.actions
// export const outputData = (state => state.extraction.outputText)
// export const loading = (state => state.extraction.loading)

// export default extractionSlice.reducer;





// const prompt = `return a json for ${userInput}`;
// const schema = {
//     "type": "object",
//     "properties": {
//         "Name": {
//             "type": "string",
//             "description": "Descriptive name of person"
//         },
//         "Email": {
//             "type": "string",
//             "description": "email of person"
//         }, "Phone": {
//             "type": "string",
//             "description": "Phone,contact,mobile,cell number of person"
//         },
//         "Experience": {
//             "type": "array",
//             "items": { "type": "string" }
//         }, "Education": {
//             "type": "array",
//             "items": { "type": "string" }
//         }, "Skills": {
//             "type": "array",
//             "items": { "type": "string" }
//         }, "Projects": {
//             "type": "array",
//             "items": { "type": "string" }
//         }, "Interests": {
//             "type": "array",
//             "items": { "type": "string" }
//         },

//     }
// }