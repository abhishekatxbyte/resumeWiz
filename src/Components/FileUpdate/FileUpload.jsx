import React, { useState, useRef } from 'react';
import { pdfjs } from 'react-pdf';
import './../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_DATA, ADD_FILE, SET_LOADING, ai_status, sendTextForExtraction } from './../../store/slice';
import { extractData } from './extractData';
import Tesseract from "tesseract.js";
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Function to convert a string to XML
function str2xml(str) {
    if (str.charCodeAt(0) === 65279) {
        // BOM sequence
        str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
}

// Function to extract paragraphs from a DOCX file content
function getParagraphs(content) {
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

async function convertPdfToText(pdf, ai_enable, dispatch) {
    try {
        let extractedText = '';
        const keywordRegex = /^(.*?(EDUCATION|CURRICULUM|HISTORY|PROFESSIONAL|Name|ADDRESS|EXPERIENCE|EXPERIENCES|internshipS|DOB|OBJECTIVE|Languages|Date\s+of\s+Birth|Resume|PROFESSIONAL|HISTORY|Nationality|Marital Status|Gender|PROJECT|PROJECTS|INTERESTS|SKILLS|SKILL|CONTACT|SUMMARY|PROFILE|ABOUT|HOBBIES|RESUME|CAREER|INTERESTS).*?)$/im;

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
            dispatch(sendTextForExtraction(extractedText))
        } else {
            dispatch(ADD_DATA(extractedText ? extractData(extractedText) : null))
        }

    } catch (error) {
        console.error('Error converting PDF to text:', error);
    }
}

function FileUpload() {
    const inputRef = useRef();
    const [percentage, setPercentage] = useState(0);
    const ai_enable = useSelector(ai_status);
    const dispatch = useDispatch();

    // Function to handle PDF file
    const handlePdfFile = async (file) => {
        const fileUrl = URL.createObjectURL(file);

        try {
            const pdf = await pdfjs.getDocument(fileUrl).promise;
            dispatch(ADD_FILE(fileUrl));
            convertPdfToText(pdf, ai_enable, dispatch);
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    };

    // Function to handle image file
    const handleImageFile = async (file) => {
        const reader = new FileReader();
        reader.onload = async (readerEvt) => {
            let base64String = readerEvt.target.result;

            dispatch(SET_LOADING(true))
            const { data } = await Tesseract.recognize(base64String, "eng", {
                logger: (m) => {
                    if (m.status === "recognizing text") {
                        setPercentage(parseInt(m.progress * 100));
                    }
                },
            });
            const extractedText = data.text
            dispatch(SET_LOADING(false))

            if (extractedText) {
                if (ai_enable) {
                    dispatch(sendTextForExtraction(extractedText))
                } else {
                    dispatch(ADD_DATA(extractedText ? extractData(extractedText) : null))
                }
            }
        };
        reader.readAsDataURL(file);
    };

    // Function to handle file change (PDF, DOCX, or image)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file.type)
        if (file.type === 'application/pdf') {
            handlePdfFile(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // If it's a DOCX file, read and extract text
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const fullText = getParagraphs(content);
                if (fullText) {
                    if (ai_enable) {
                        dispatch(sendTextForExtraction(fullText))
                    } else {
                        dispatch(ADD_DATA(fullText ? extractData(fullText) : null))
                    }
                }
            };
            reader.readAsBinaryString(file);
        } else if (file.type.startsWith('image/')) {
            // If it's an image file, handle it separately
            handleImageFile(file);
        }
    };
    console.log(percentage)

    return (
        <div>
            <div className="container">
                <div className="card">
                    <h3>Upload Files</h3>
                    <div className="drop_box">
                        <header>
                            <h4>Select File here</h4>
                        </header>
                        <p>File Supported: PDF, DOCX, JPG, PNG, JPEG</p>

                        <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" id="fileID" style={{ display: "none" }} onChange={handleFileChange} ref={inputRef} />
                        <button className="btn" onClick={() => inputRef.current.click()}>Choose File</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default FileUpload;

