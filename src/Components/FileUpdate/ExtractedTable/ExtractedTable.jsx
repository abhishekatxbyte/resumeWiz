import React from 'react';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import { MultipleData } from '../../../store/slice';
import GridFromAntd from './GridFromAntd';

function ExtractedTable() {
    const data = useSelector(MultipleData);
    console.log(data)
    // Check if data is not null and has at least one item
    if (data !== null && data?.length > 0) {
        // Extract the headers from the first data object while excluding "fileName"
        const headers = Object.keys(data[0])?.filter(header => header !== "fileName");
        return (
            <GridFromAntd />
        );
    } else {
        return (
            <></>
        );
    }
}

export default ExtractedTable;
