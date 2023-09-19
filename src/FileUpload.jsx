// multiple

import React, { useState, useEffect, useRef } from 'react';
import { pdfjs } from 'react-pdf';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_DATA, ai_status, sendTextForExtraction } from './store/slice';
import { extractData } from './extractData';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function FileUpload() {
    const inputRef = useRef();
    const [pdfFiles, setPdfFiles] = useState([]);
    const ai_enable = useSelector(ai_status)
    const dispatch = useDispatch();

    useEffect(() => {
        async function convertPdfToText(pdf) {
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

        if (pdfFiles.length > 0) {
            const processNextFile = async (index) => {
                if (index < pdfFiles.length) {
                    const file = pdfFiles[index];
                    const fileUrl = URL.createObjectURL(file);

                    try {
                        const pdf = await pdfjs.getDocument(fileUrl).promise;
                        convertPdfToText(pdf);
                    } catch (error) {
                        console.error('Error loading PDF:', error);
                    }

                    // Process the next file
                    processNextFile(index + 1);
                }
            };

            // Start processing files
            processNextFile(0);
        }
    }, [pdfFiles]);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setPdfFiles(Array.from(files));
        }
    };

    // Add logic to iterate through extracted data for each PDF file

    return (
        <div>
            <div className="container">
                <div className="card">
                    <h3>Upload Files</h3>
                    <div className="drop_box">
                        <header>
                            <h4>Select File(s) here</h4>
                        </header>
                        <p>Files Supported: PDF</p>
                        <input type="file" accept=".pdf" id="fileID" style={{ display: "none" }} onChange={handleFileChange} ref={inputRef} />
                        <button className="btn" onClick={() => inputRef.current.click()}>Choose File(s)</button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUpload;






// // single
// import React, { useState, useEffect, useRef } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { ADD_DATA, loading, outputData, sendTextForExtraction } from './store/slice';
// import { useNavigate } from 'react-router-dom';
// import { extractData } from './extractData';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// function FileUpload() {
//     const inputRef = useRef();
//     const [pdfText, setPdfText] = useState('');
//     const [numPages, setNumPages] = useState(null);
//     const [pdfFile, setPdfFile] = useState(null);
//     const dispatch = useDispatch()
//     useEffect(() => {
//         async function convertPdfToText(pdf) {
//             try {
//                 let extractedText = '';
//                 const keywordRegex = /^(.*?(EDUCATION|ADDRESS|EXPERIENCE|EXPERIENCES|internshipS|DOB|OBJECTIVE|PERSONAL\s+DETAILS|Languages|Date\s+of\s+Birth|CAREER OBJECTIVE|Nationality|Marital Status|Gender|PROJECT|PROJECTS|INTERESTS|SKILLS|SKILL|CONTACT|SUMMARY|PROFILE|ABOUT|HOBBIES|INTERESTS).*?)$/im;


//                 for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//                     const page = await pdf.getPage(pageNum);
//                     const pageText = await page.getTextContent();
//                     const lines = pageText.items.map(item => item.str.trim());

//                     for (let i = 0; i < lines.length; i++) {
//                         const line = lines[i];

//                         // Check if the line matches any of the keywords using regex
//                         const shouldStartNewLine = keywordRegex.test(line);

//                         if (shouldStartNewLine) {
//                             extractedText += '\n';
//                         }

//                         extractedText += line + ' ';
//                     }
//                 }
//                 // extractedText = extractedText.replace(/\s+/g, ' ');
//                 // console.log(extractedText)
//                 setPdfText(extractedText);
//             } catch (error) {
//                 console.error('Error converting PDF to text:', error);
//             }
//         }

//         if (pdfFile) {
//             const loadingTask = pdfjs.getDocument(pdfFile);
//             loadingTask.promise.then(pdf => {
//                 convertPdfToText(pdf);
//             });
//         }
//     }, [pdfFile]);




//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setPdfFile(URL.createObjectURL(file));
//             setPdfText('');
//         }
//     };
//     const data = useSelector(outputData)
//     const isDataLoaded = useSelector(loading)
//     const extractedData = extractData(pdfText);
//     return (
//         <div>
//             <div className="container">
//                 <div className="card">
//                     <h3>Upload Files</h3>
//                     <div className="drop_box">
//                         <header>
//                             <h4>Select File here</h4>
//                         </header>
//                         <p>Files Supported: PDF</p>
//                         <input type="file" hidden accept=",pdf" id="fileID" style={{ display: "none" }} onChange={handleFileChange} ref={inputRef} />
//                         <button className="btn" onClick={() => inputRef.current.click()}>Choose File</button>
//                     </div>
//                     {/* <Document file={pdfFile} onLoadSuccess={() => { }}>
//                             {Array.from(new Array(numPages), (_, index) => (
//                                 <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//                             ))}
//                         </Document> */}
//                 </div>

//             </div>
//         </div>
//     );
// }

// export default FileUpload;










// {/* <Document file={pdfFile} onLoadSuccess={() => { }}>
// {Array.from(new Array(numPages), (_, index) => (
//     <Page key={`page_${index + 1}`} pageNumber={index + 1} />
// ))}
// </Document> */}