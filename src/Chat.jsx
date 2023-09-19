import React, { useState } from 'react';
import axios from 'axios';
import ExtractedTable from './ExtractedTable';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_DATA } from './store/slice';

const Chat = ({ inputText }) => {
    const dispatch = useDispatch()



    const state = useSelector(state => state.extraction.outputText)
    console.log(state.extraction)
    return (
        <div>
            <h1>Abhishek React App</h1>
            <div>
                <button onClick={() => dispatch(ADD_DATA())}>Send</button>
            </div>
            {/* <ExtractedTable outputText={outputText} /> */}


        </div>
    );
};

export default Chat;
