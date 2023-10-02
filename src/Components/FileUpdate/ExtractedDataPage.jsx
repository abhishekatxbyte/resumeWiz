
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSelector } from 'react-redux';
import { inputFile, outputData } from './../../store/slice';
import Name from './../../assets/person.svg'
import Education from './../../assets/education.svg'
import Experience from './../../assets/experience.svg'
import Skills from './../../assets/skill.svg'
import Projects from './../../assets/projects.svg'
import Interests from './../../assets/interests.svg'
import Pdf from './../../assets/pdf.svg'

import './ExtractedDataPage.css'
import { Document, Page } from 'react-pdf';
function ExtractedDataPage() {
    let result = useSelector(outputData)
    let pdfFile = useSelector(inputFile)
    console.log(result, typeof result)
    if (typeof result === "string") {
        const data = JSON.parse(result)
        result = data
    }
    const [key, setKey] = useState('home');
    if (!result) {
        return null; // Handle the case where results are not defined
    }
    else {
        return (
            <div className='tab'>

                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className='tabs'
                >
                    {Object.entries(result).map(([propName, propValue]) => {

                        return <Tab key={propName} eventKey={propName} title={<div className='header'>

                            <div >
                                {
                                    propName === 'Profile' ?
                                        <img src={Name} alt="iconImage" /> :

                                        propName === 'Education' ? <img src={Education} alt="iconImage" /> :
                                            propName === 'Experience' ? <img src={Experience} alt="iconImage" /> :
                                                propName === 'Skills' ? <img src={Skills} alt="iconImage" /> :
                                                    propName === 'Projects' ? <img src={Projects} alt="iconImage" /> :
                                                        propName === 'Interests' ? <img src={Interests} alt="iconImage" /> : <></>

                                }
                            </div>
                            <p>{propName}</p></div>


                        }>
                            <div className='extractedData'>
                                <h1>{propName}</h1>
                                {!Array.isArray(propValue) ? <ul className='list_container'>
                                    {propValue ? <> {Object?.keys(propValue).map(key => (
                                        <li className='item_list' key={key}>
                                            <strong>{key} : </strong> {propValue[key]}
                                        </li>
                                    ))} </> : <></>}
                                </ul> : <ul className='list_container'>{propValue.map(item => {
                                    return <li className='item_list'>{item}</li>
                                })}</ul>}
                            </div>
                        </Tab>

                    })}
                    <Tab key={4545} eventKey={64} title={<div className='header'>

                        <div >
                            <img src={Pdf} alt="iconImage" />
                        </div>
                        <p>view resume</p></div>


                    }>
                        <div className='extractedData'>
                            <h1>pdf view</h1>
                            <Document file={pdfFile}>
                                <Page wrap={false} pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
                            </Document>
                        </div>
                    </Tab>
                </Tabs>
            </div>

        );
    }
}

export default ExtractedDataPage;