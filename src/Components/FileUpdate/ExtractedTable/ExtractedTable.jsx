import React from 'react';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import { MultipleData } from '../../../store/slice';

function ExtractedTable() {
    const data = useSelector(MultipleData);
    console.log(data)
    // Check if data is not null and has at least one item
    if (data !== null && data?.length > 0) {
        // Extract the headers from the first data object while excluding "fileName"
        const headers = Object.keys(data[0])?.filter(header => header !== "fileName");
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No.</th>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{(index + 1).toString().padStart(2, '0')}</td>
                            {headers.map((header, headerIndex) => (
                                <td key={headerIndex}>{item[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    } else {
        // Handle the case where data is null or empty
        return (
            <></>
        );
    }
}

export default ExtractedTable;
