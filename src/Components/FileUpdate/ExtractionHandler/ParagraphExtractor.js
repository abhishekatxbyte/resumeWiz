import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";


function str2xml(str) {
    if (str.charCodeAt(0) === 65279) {
        str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
}

// Function to extract paragraphs from a DOCX file content
export function getParagraphs(content) {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    let fullText = ""; // Initialize a single string to store paragraphs

    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
        const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
        for (let j = 0, len2 = textsXml.length; j < len2; j++) {
            const textXml = textsXml[j];
            if (textXml.childNodes) {
                fullText += textXml.childNodes[0].nodeValue;
            }
        }
        if (fullText && i < len - 1) {
            // Add a newline between paragraphs
            fullText += "\n";
        }
    }
    return fullText; // Return a single string containing all paragraphs
}