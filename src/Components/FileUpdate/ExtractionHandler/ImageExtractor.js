// import Tesseract from "tesseract.js";
const keywordRegex = /^(.*?(EDUCATION|CURRICULUM|HISTORY|PROFESSIONAL|Name|ADDRESS|EXPERIENCE|EXPERIENCES|internshipS|DOB|OBJECTIVE|Languages|Date\s+of\s+Birth|Resume|PROFESSIONAL|HISTORY|Nationality|Marital Status|Gender|PROJECT|PROJECTS|INTERESTS|SKILLS|SKILL|CONTACT|SUMMARY|PROFILE|ABOUT|HOBBIES|RESUME|CAREER|INTERESTS).*?)$/im;
// export const handleImageFile = async (file, dispatch, SET_LOADING, submit, ADD_DATA, switchState, schema, setPercentage, ai_enable, extractData, sendTextForExtraction) => {
//     const reader = new FileReader();
//     reader.onload = async (readerEvt) => {
//         let base64String = readerEvt.target.result;
//         dispatch(SET_LOADING(true))
//         const { data } = await Tesseract.recognize(base64String, "eng", {
//             logger: (m) => {
//                 if (m.status === "recognizing text") {
//                     setPercentage(parseInt(m.progress * 100));
//                 }
//             },
//         });
//         const extractedText = data.text
//         dispatch(SET_LOADING(false))

//         if (extractedText) {
//             if (ai_enable) {
//                 submit()
//                 const propObject = {
//                     userInput: extractedText, enableCustom: switchState, customSchema: schema
//                 }
//                 console.log(propObject)
//                 dispatch(sendTextForExtraction(propObject))
//             } else {
//                 dispatch(ADD_DATA(extractedText ? extractData(extractedText, keywordRegex) : null))
//             }
//         }
//     };
//     reader.readAsDataURL(file);
// };
import Tesseract from "tesseract.js";
import { ADD_DATA, SET_LOADING } from "../../../store/slice";
export const handleImageFile = async (
    file,
    dispatch,
    submit,
    switchState,
    schema,
    ai_enable,
    extractData,
    sendTextForExtraction
) => {
    try {

        const reader = new FileReader();
        reader.onload = async (readerEvt) => {
            const base64String = readerEvt.target.result;
            dispatch(SET_LOADING(true));

            const { data } = await Tesseract.recognize(base64String, "eng", {
                logger: (m) => {
                    if (m.status === "recognizing text") {

                    }
                },
            });

            const extractedText = data.text;
            dispatch(SET_LOADING(false));

            if (extractedText) {
                if (ai_enable) {
                    submit();
                    const propObject = {
                        userInput: extractedText,
                        enableCustom: switchState,
                        customSchema: schema,
                    };
                    console.log(propObject);
                    if (ai_enable) {
                        dispatch(sendTextForExtraction(propObject));
                    }
                } else {
                    dispatch(
                        ADD_DATA(
                            extractedText ? extractData(extractedText, dispatch) : null
                        )
                    );
                }
            }
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error("Error processing image:", error);
        // Handle the error appropriately (e.g., display a message to the user)
    }
};
