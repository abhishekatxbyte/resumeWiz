import { ADD_DATA, sendTextForExtraction } from "../../../store/slice";
import { extractData } from "../extractData";

const keywordRegex = /^(.*?(EDUCATION|CURRICULUM|HISTORY|PROFESSIONAL|Name|ADDRESS|EXPERIENCE|EXPERIENCES|internshipS|DOB|OBJECTIVE|Languages|Date\s+of\s+Birth|Resume|PROFESSIONAL|HISTORY|Nationality|Marital Status|Gender|PROJECT|PROJECTS|INTERESTS|SKILLS|SKILL|CONTACT|SUMMARY|PROFILE|ABOUT|HOBBIES|RESUME|CAREER|INTERESTS).*?)$/im;


export async function convertPdfToText(pdf, ai_enable, dispatch, switchState, customSchema) {
    try {
        let extractedText = '';


        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const pageText = await page.getTextContent();
            const lines = pageText.items.map(item => item.str.trim());

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Check if the line matches any of the keywords using regex
                const shouldStartNewLine = keywordRegex.test(line);

                if (shouldStartNewLine) {
                    extractedText += '\n';
                }
                extractedText += line + ' ';
            }
        }

        if (ai_enable) {
            console.log(customSchema)
            const propObject = {
                userInput: extractedText, enableCustom: switchState, customSchema: customSchema
            }
            console.log(propObject)
            dispatch(sendTextForExtraction(propObject))
        } else {
            const extractedData = extractData(extractedText, dispatch)
            dispatch(ADD_DATA(extractedText ? extractedData : null))
        }

    } catch (error) {
        console.error('Error converting PDF to text:', error);
    }
}