// import React, { useState, useRef, useEffect } from 'react';
// import { pdfjs } from 'react-pdf';
// import './../../App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { ADD_DATA, ADD_FILE, ENABLE_CUSTOM, EnableCustom, SET_CUSTOM_SCHEMA, SET_LOADING, ai_status, sendTextForExtraction } from './../../store/slice';
// import { extractData } from './extractData';
// import { Form } from 'react-bootstrap';
// import { getParagraphs } from './ExtractionHandler/ParagraphExtractor';
// import { handleImageFile } from './ExtractionHandler/ImageExtractor';
// import { convertPdfToText } from './ExtractionHandler/PdfExtratractor';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const keywordRegex = /^(.*?(EDUCATION|CURRICULUM|HISTORY|PROFESSIONAL|Name|ADDRESS|EXPERIENCE|EXPERIENCES|internshipS|DOB|OBJECTIVE|Languages|Date\s+of\s+Birth|Resume|PROFESSIONAL|HISTORY|Nationality|Marital Status|Gender|PROJECT|PROJECTS|INTERESTS|SKILLS|SKILL|CONTACT|SUMMARY|PROFILE|ABOUT|HOBBIES|RESUME|CAREER|INTERESTS).*?)$/im;

// function FileUpload() {
//     const inputRef = useRef();
//     const [switchState, setSwitchState] = useState(false);
//     const [formFields, setFormFields] = useState([
//         { category: '', keywords: '', description: '' },
//     ])
//     let schema = {
//         "type": "object",
//         "properties": {
//             "Profile": {
//                 "type": "object",
//                 "properties": {
//                     "Name": {
//                         "type": "string",
//                         "description": "Descriptive name of person"
//                     },
//                     "Email": {
//                         "type": "string",
//                         "description": "Email of person"
//                     },
//                     "Phone": {
//                         "type": "string",
//                         "description": "Phone, contact, mobile, cell number of person"
//                     }
//                 },
//                 "required": ["Name", "Email", "Phone"] // Add required fields if necessary
//             },
//             "Education": {
//                 "type": "array",
//                 "items": { "type": "string" }
//             },
//             "Experience": {
//                 "type": "array",
//                 "items": { "type": "string" }
//             },
//             "Skills": {
//                 "type": "array",
//                 "items": { "type": "string" }
//             },
//             "Projects": {
//                 "type": "array",
//                 "items": { "type": "string" }
//             },
//             "Interests": {
//                 "type": "array",
//                 "items": { "type": "string" }
//             }
//         }
//     };
//     const ai_enable = useSelector(ai_status);
//     const dispatch = useDispatch();
//     // Function to handle PDF file
//     const handlePdfFile = async (file) => {
//         const fileUrl = URL.createObjectURL(file);

//         try {
//             const pdf = await pdfjs.getDocument(fileUrl).promise;
//             dispatch(ADD_FILE(fileUrl));
//             convertPdfToText(pdf, ai_enable, dispatch, switchState, schema);
//         } catch (error) {
//             console.error('Error loading PDF:', error);
//         }
//     };

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];

//         if (file instanceof File || file instanceof Blob) {
//             try {
//                 submit();

//                 if (file.type === 'application/pdf') {
//                     handlePdfFile(file);
//                 } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//                     // If it's a DOCX file, read and extract text
//                     const reader = new FileReader();
//                     reader.onload = async (e) => {
//                         const content = e.target.result;
//                         const fullText = getParagraphs(content);
//                         if (fullText) {
//                             if (ai_enable) {
//                                 console.log(schema);
//                                 const propObject = {
//                                     userInput: fullText,
//                                     enableCustom: switchState,
//                                     customSchema: schema,
//                                 };
//                                 console.log(schema);

//                                 dispatch(sendTextForExtraction(propObject));
//                             } else {
//                                 dispatch(
//                                     ADD_DATA(
//                                         fullText ? extractData(fullText, keywordRegex) : null
//                                     )
//                                 );
//                             }
//                         }
//                     };
//                     reader.readAsBinaryString(file);
//                 } else if (file.type.startsWith('image/')) {
//                     // If it's an image file, handle it separately
//                     handleImageFile(file, dispatch, submit, switchState, schema, ai_enable, extractData, sendTextForExtraction);
//                 }
//             } catch (error) {
//                 console.error("Error handling file:", error);
//             }
//         } else {
//             console.error("Invalid file object:", file);
//         }
//     };

//     // switch for changing resume to abstract
//     const handleSwitchChange = () => {
//         setSwitchState(!switchState);
//     };

//     useEffect(() => {
//         dispatch(ENABLE_CUSTOM(switchState))
//     }, [switchState])


//     const custom_enable = useSelector(EnableCustom)
//     const handleFormChange = (event, index) => {
//         let data = [...formFields];
//         data[index][event.target.name] = event.target.value;
//         setFormFields(data);
//     }
//     const submit = () => {
//         function generateCustomSchema() {
//             const schema = {
//                 type: 'object',
//                 properties: {},
//             };

//             formFields.forEach((obj) => {
//                 const category = obj.category;

//                 if (category) {
//                     const categoryProperties = obj.keywords.split(',').map((keyword) => keyword.trim());
//                     const properties = {};

//                     categoryProperties.forEach((prop) => {
//                         properties[prop] = {
//                             type: 'string',
//                             description: obj.description,
//                         };
//                     });

//                     schema.properties[category] = {
//                         type: 'object',
//                         properties,
//                     };
//                 }
//             });
//             return schema;
//         }
//         if (custom_enable && formFields.category !== '') {
//             schema = generateCustomSchema();
//         }
//     }

//     const addFields = () => {
//         let object = { category: '', keywords: '', description: '' }
//         setFormFields([...formFields, object])
//     }
//     const removeFields = (index) => {
//         let data = [...formFields];
//         data.splice(index, 1)
//         setFormFields(data)
//     }

//     return (
//         <div>
//             <div className="container">
// {ai_enable ? <>
//     <div style={{ display: "flex" }}>
//         <Form>
//             <Form.Check
//                 type="switch"
//                 id="custom-switch"
//                 checked={switchState}
//                 onChange={handleSwitchChange}
//             />
//         </Form>
//         <p>Toggle Switch for custom parameter</p>
//     </div>
//     {switchState ? <>

//         <form>
//             {formFields.map((form, index) => {
//                 return (
//                     <div key={index}>
//                         <input
//                             name='category'
//                             placeholder='category'
//                             onChange={event => handleFormChange(event, index)}
//                             value={form.category}
//                         />
//                         <input
//                             name='keywords'
//                             placeholder='keywords'
//                             onChange={event => handleFormChange(event, index)}
//                             value={form.keywords}
//                         />
//                         <input
//                             name='description'
//                             placeholder='description'
//                             onChange={event => handleFormChange(event, index)}
//                             value={form.description}
//                         />
//                         <button onClick={() => removeFields(index)}>Remove</button>
//                     </div>
//                 )
//             })}
//         </form>
//         <button onClick={addFields}>Add More..</button>
//     </> : <></>}
// </> : <></>
// }
//                 <div className="card">
//                     <h3>Upload Files</h3>
//                     <div className="drop_box">
//                         <header>
//                             <h4>Select File here</h4>
//                         </header>
//                         <p>File Supported: PDF, DOCX, JPG, PNG, JPEG</p>

//                         <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" id="fileID" style={{ display: "none" }} onChange={handleFileChange} ref={inputRef} />
//                         <button className="btn" onClick={() => inputRef.current.click()}>Choose File</button>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// }

// export default FileUpload;
import React, { useState, useRef, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import './../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_DATA, ADD_FILE, ENABLE_CUSTOM, EnableCustom, SET_CUSTOM_SCHEMA, SET_LOADING, ai_status, sendTextForExtraction } from './../../store/slice';
import { extractData } from './extractData';
import { Form } from 'react-bootstrap';
import { getParagraphs } from './ExtractionHandler/ParagraphExtractor';
import { handleImageFile } from './ExtractionHandler/ImageExtractor';
import { convertPdfToText } from './ExtractionHandler/PdfExtratractor';
import ExtractedTable from './ExtractedTable/ExtractedTable';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const keywordRegex = /^(.*?(EDUCATION|CURRICULUM|HISTORY|PROFESSIONAL|Name|ADDRESS|EXPERIENCE|EXPERIENCES|internshipS|DOB|OBJECTIVE|Languages|Date\s+of\s+Birth|Resume|PROFESSIONAL|HISTORY|Nationality|Marital Status|Gender|PROJECT|PROJECTS|INTERESTS|SKILLS|SKILL|CONTACT|SUMMARY|PROFILE|ABOUT|HOBBIES|RESUME|CAREER|INTERESTS).*?)$/im;

function FileUpload() {
    const inputRef = useRef();
    const [switchState, setSwitchState] = useState(false);
    const [formFields, setFormFields] = useState([
        { category: '', keywords: '', description: '' },
    ])
    const [processedFiles, setProcessedFiles] = useState([]); // New state for processed files

    let schema = {
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
    const ai_enable = useSelector(ai_status);
    const dispatch = useDispatch();
    // Function to handle PDF file
    const handlePdfFile = async (file) => {
        const fileUrl = URL.createObjectURL(file);

        try {
            const pdf = await pdfjs.getDocument(fileUrl).promise;
            dispatch(ADD_FILE(fileUrl));
            convertPdfToText(pdf, ai_enable, dispatch, switchState, schema);
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    };

    // const handleFileChange = async (e) => {
    //     const file = e.target.files[0];

    //     if (file instanceof File || file instanceof Blob) {
    //         try {
    //             submit();

    //             if (file.type === 'application/pdf') {
    //                 handlePdfFile(file);
    //             } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // // If it's a DOCX file, read and extract text
    // const reader = new FileReader();
    // reader.onload = async (e) => {
    //     const content = e.target.result;
    //     const fullText = getParagraphs(content);
    //     if (fullText) {
    //         if (ai_enable) {
    //             console.log(schema);
    //             const propObject = {
    //                 userInput: fullText,
    //                 enableCustom: switchState,
    //                 customSchema: schema,
    //             };
    //             console.log(schema);

    //             dispatch(sendTextForExtraction(propObject));
    //         } else {
    //             dispatch(
    //                 ADD_DATA(
    //                     fullText ? extractData(fullText, keywordRegex) : null
    //                 )
    //             );
    //         }
    //     }
    // };
    // reader.readAsBinaryString(file);
    //             } else if (file.type.startsWith('image/')) {
    //                 // If it's an image file, handle it separately
    // handleImageFile(file, dispatch, submit, switchState, schema, ai_enable, extractData, sendTextForExtraction);
    //             }
    //         } catch (error) {
    //             console.error("Error handling file:", error);
    //         }
    //     } else {
    //         console.error("Invalid file object:", file);
    //     }
    // };
    const handleFileChange = async (e) => {
        const files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file instanceof File || file instanceof Blob) {
                try {
                    submit();

                    if (file.type === 'application/pdf') {
                        await handlePdfFile(file);
                    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        // If it's a DOCX file, read and extract text
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            const content = e.target.result;
                            const fullText = getParagraphs(content);
                            if (fullText) {
                                if (ai_enable) {
                                    console.log(schema);
                                    const propObject = {
                                        userInput: fullText,
                                        enableCustom: switchState,
                                        customSchema: schema,
                                    };
                                    console.log(schema);

                                    dispatch(sendTextForExtraction(propObject));
                                } else {
                                    const extratedData = extractData(fullText, dispatch)
                                    dispatch(
                                        ADD_DATA(
                                            fullText ? extratedData : null
                                        )
                                    );
                                }
                            }
                        };
                        reader.readAsBinaryString(file);
                    } else if (file.type.startsWith('image/')) {
                        handleImageFile(file, dispatch, submit, switchState, schema, ai_enable, extractData, sendTextForExtraction);
                    }
                    // Add the processed file to the array

                    setProcessedFiles((prevProcessedFiles) => [...prevProcessedFiles, file]);
                } catch (error) {
                    console.error("Error handling file:", error);
                }
            } else {
                console.error("Invalid file object:", file);
            }
        }
    };
    // switch for changing resume to abstract
    const handleSwitchChange = () => {
        setSwitchState(!switchState);
    };

    useEffect(() => {
        dispatch(ENABLE_CUSTOM(switchState))
    }, [switchState])


    const custom_enable = useSelector(EnableCustom)
    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
    }
    const submit = () => {
        function generateCustomSchema() {
            const schema = {
                type: 'object',
                properties: {},
            };

            formFields.forEach((obj) => {
                const category = obj.category;

                if (category) {
                    const categoryProperties = obj.keywords.split(',').map((keyword) => keyword.trim());
                    const properties = {};

                    categoryProperties.forEach((prop) => {
                        properties[prop] = {
                            type: 'string',
                            description: obj.description,
                        };
                    });

                    schema.properties[category] = {
                        type: 'object',
                        properties,
                    };
                }
            });
            return schema;
        }
        if (custom_enable && formFields.category !== '') {
            schema = generateCustomSchema();
        }
    }

    const addFields = () => {
        let object = { category: '', keywords: '', description: '' }
        setFormFields([...formFields, object])
    }
    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
    }
    return (
        <div>
            <div className="container">
                {ai_enable ? <>
                    <div style={{ display: "flex" }}>
                        <Form>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                checked={switchState}
                                onChange={handleSwitchChange}
                            />
                        </Form>
                        <p>Toggle Switch for custom parameter</p>
                    </div>
                    {switchState ? <>

                        <form>
                            {formFields.map((form, index) => {
                                return (
                                    <div key={index}>
                                        <input
                                            name='category'
                                            placeholder='category'
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.category}
                                        />
                                        <input
                                            name='keywords'
                                            placeholder='keywords'
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.keywords}
                                        />
                                        <input
                                            name='description'
                                            placeholder='description'
                                            onChange={event => handleFormChange(event, index)}
                                            value={form.description}
                                        />
                                        <button onClick={() => removeFields(index)}>Remove</button>
                                    </div>
                                )
                            })}
                        </form>
                        <button onClick={addFields}>Add More..</button>
                    </> : <></>}
                </> : <></>
                }
                <div className="card">
                    <h3>Upload Files</h3>
                    <div className="drop_box">
                        <header>
                            <h4>Select File here</h4>
                        </header>
                        <p>File Supported: PDF, DOCX, JPG, PNG, JPEG</p>

                        <input
                            type="file"
                            accept=".pdf,.docx,.png,.jpg,.jpeg"
                            id="fileID"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            ref={inputRef}
                            multiple // Allow multiple file selection
                        />
                        <button className="btn" onClick={() => inputRef.current.click()}>
                            Choose File
                        </button>
                    </div>
                </div>

                {/* Display the list of processed files */}
                <ExtractedTable />
            </div>
        </div>
    );
}

export default FileUpload;
