import { ADD_DATA, sendTextForExtraction } from "../../../store/slice";
import { extractData } from "../extractData";

const keywordRegex = /^(.*?(EDUCATION|CURRICULUM|HISTORY|PROFESSIONAL|Name|ADDRESS|EXPERIENCE|EXPERIENCES|internshipS|DOB|OBJECTIVE|Languages|Date\s+of\s+Birth|Resume|PROFESSIONAL|HISTORY|Nationality|Marital Status|Gender|PROJECT|PROJECTS|INTERESTS|SKILLS|SKILL|CONTACT|SUMMARY|PROFILE|ABOUT|HOBBIES|RESUME|CAREER|INTERESTS).*?)$/im;


export async function convertPdfToText(pdf, setMultipleExtracted) {
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
        console.log(extractedText)
        setMultipleExtracted(prev => [...prev, extractedText])
        return extractedText

    } catch (error) {
        console.error('Error converting PDF to text:', error);
    }
}