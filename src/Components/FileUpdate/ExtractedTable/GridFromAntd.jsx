import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Space, Table, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import { useSelector } from 'react-redux';
import { MultipleData } from '../../../store/slice';
const EditableContext = React.createContext(null);




const GridFromAntd = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        confirm();
        setSearchedColumn('');
        setSearchText('');
    };
    const dataArray = useSelector(MultipleData);

    const getColumnSearchProps = (dataIndex) => ({
        filterSearch: true,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : '#22222',
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const dynamicColumns = Object.keys(dataArray[0]).map((key) => ({
        title: key,
        dataIndex: key,
        editable: true,
        ...getColumnSearchProps(key),
        sorter: (a, b) => {
            const valueA = typeof a[key] === 'number' ? a[key] : parseFloat(a[key]) || 0;
            const valueB = typeof b[key] === 'number' ? b[key] : parseFloat(b[key]) || 0;

            if (valueA < valueB) {
                return -1;
            }
            if (valueA > valueB) {
                return 1;
            }

            // If numeric comparison didn't determine the order, fall back to string comparison
            return String(a[key]).localeCompare(String(b[key]));
        },

        sortDirections: ['ascend', 'descend'],

        render: (address) => (
            <Tooltip placement="topLeft" title={address}>
                {address}
            </Tooltip>
        ),
    }));

    const columns = dynamicColumns
    return (
        <div>
            {dataArray.length > 0 && <Table
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataArray}
                scroll={true}
                columns={columns}
            />}


        </div>
    );
};

export default GridFromAntd;
