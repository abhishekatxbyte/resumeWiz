import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthContainer from '../auth/AuthSignUp'
import ExtractedDataPage from '../Components/FileUpdate/ExtractedDataPage'
// import { ENABLE_AI, REMOVE_DATA } from '../store/slice'
// import { useDispatch } from 'react-redux'
// import { Button, Form } from 'antd'
// import { useNavigate } from 'react-router-dom';
import FileUpload from '../Components/FileUpdate/FileUpload'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify'
import AuthSignUp from '../auth/AuthSignUp'
import AuthSignIn from '../auth/AuthSignin'


const AppRoutes = () => {
    // const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(ENABLE_AI(switchState))
    // }, [switchState])

    // const layout = (prop) => {

    //     const handleSwitchChange = () => {
    //         setSwitchState(!switchState);
    //     };
    //     const handleButtonClick = () => {
    //         navigate('/')
    //         dispatch(REMOVE_DATA)
    //     }
    //     return <>
    //         <div style={{ display: "flex", justifyContent: "space-between", padding: '1em' }}>
    //             <div style={{ display: "flex" }}>
    //                 <Form>
    //                     <Form.Check
    //                         type="switch"
    //                         id="custom-switch"
    //                         checked={switchState}
    //                         onChange={handleSwitchChange}
    //                     />
    //                 </Form>
    //                 <p>Toggle Switch for enebling Ai</p>
    //             </div>
    //             <Button variant="secondary" onClick={handleButtonClick}>
    //                 home
    //             </Button>
    //         </div>
    //         {prop}
    //     </>

    // }
    return (
        <>

            <Routes>
                <Route path="/signup" element={<AuthSignUp />} />
                <Route path="/signin" element={<AuthSignIn />} />
                <Route path="/" element={<FileUpload />} />
                <Route path="/data" element={<ExtractedDataPage />} />
            </Routes>
            <Toaster />
            <ToastContainer />
        </>
    )
}

export default AppRoutes