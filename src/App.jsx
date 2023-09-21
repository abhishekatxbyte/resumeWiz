import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ENABLE_AI, loading, outputData, REMOVE_DATA } from './store/slice';
import { Button, Form, Spinner } from 'react-bootstrap';
import FileUpload from './Components/FileUpdate/FileUpload';
import ExtractedTable from './Components/FileUpdate/ExtractedTable';
import Ocr from './Components/FileUpdate/Ocr';



function App() {
  const isloading = useSelector(loading)
  const [switchState, setSwitchState] = useState(false);
  const data = useSelector(outputData)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (isloading) {
      navigate('/loading')
    }
    else if (data && !isloading) {
      navigate('/data')
    } else {
      navigate('/')
    }
  }, [data, isloading])

  useEffect(() => {
    dispatch(ENABLE_AI(switchState))
  }, [switchState])
  const layout = (prop) => {
    const handleSwitchChange = () => {
      setSwitchState(!switchState);
    };
    const handleButtonClick = () => {
      navigate('/')
      dispatch(REMOVE_DATA)
    }
    return <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: '1em' }}>
        <div style={{ display: "flex" }}>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={switchState}
              onChange={handleSwitchChange}
            />
          </Form>
          <p>Toggle Switch for enebling Ai</p>
        </div>
        <Button variant="secondary" onClick={handleButtonClick}>
          home
        </Button>
      </div>
      {prop}
    </>

  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={layout(<FileUpload />)} />
        <Route path="/ocr" element={layout(<Ocr />)} />

        <Route path="/data" element={layout(<><ExtractedTable /></>)} />
        <Route path="/loading" element={<Spinner animation="border" />} />
      </Routes>
    </div>
  );
}

export default App;
