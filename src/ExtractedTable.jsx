
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSelector } from 'react-redux';
import { outputData } from './store/slice';

function ExtractedTable() {
    let result = useSelector(outputData)
    if (typeof result === "string") {
        result = JSON.parse(result)
    }
    console.log(result)
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

                        return <Tab key={propName} eventKey={propName} title={propName}>
                            <h1>{propName}</h1>
                            {!Array.isArray(propValue) && typeof (propValue === 'string') ? <>{propValue}</> : <p>{propValue}</p>}
                        </Tab>
                    })}
                </Tabs>
            </div>

        );
    }
}

export default ExtractedTable;