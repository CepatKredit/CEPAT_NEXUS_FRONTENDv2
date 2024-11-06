import React, { useEffect } from 'react';
import { Table, Input } from 'antd';
import { FloatButton, notification } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

function AmountTable({ data, receive, User, creditisEdit, loading }) {
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();

    // Store a history of saved entries, starting with the initial data as the first entry
    const [dataHistory, setDataHistory] = React.useState([data]);
    const [editableData, setEditableData] = React.useState(data);

    // Toggles edit mode and resets the editable data to the latest entry
    const toggleEditMode = () => {
        setEdit(!isEdit);
        setEditableData(data); // Reset editable data when toggling edit mode
    };

    const handleInputChange = (name, value) => {
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const saveData = async () => {
        try {
            // Replace with actual API endpoint if needed
            const response = await axios.post('/api/updateAmountTable', editableData);
            if (response.status === 200) {
                // Append the new data to data history upon successful save
                setDataHistory((prevHistory) => [...prevHistory, { ...editableData }]);
                
                // Update the parent data with the saved entry
                receive(editableData);

                api.success({ message: 'Data saved successfully!' });
                setEdit(false); // Exit edit mode after saving
                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] });
            } else {
                api.error({ message: 'Failed to save data' });
            }
        } catch (error) {
            api.error({ message: 'Error saving data' });
        }
    };

    const columns = [
        { title: 'Approved Amount', dataIndex: 'ApprvAmount', key: 'ApprvAmount', render: (text) => <span>{text || 'N/A'}</span> },
        { title: 'Interest Rate (%)', dataIndex: 'ApprvInterestRate', key: 'ApprvInterestRate', render: (text) => <span>{text || 'N/A'}</span> },
        { title: 'Approved Terms', dataIndex: 'ApprvTerms', key: 'ApprvTerms', render: (text) => <span>{text ? `${text} months` : 'N/A'}</span> },
        { title: 'Monthly Amortization', dataIndex: 'MonthlyAmort', key: 'MonthlyAmort', render: (text) => <span>{text || 'N/A'}</span> },
        { title: 'Other Exposure', dataIndex: 'OtherExposure', key: 'OtherExposure', render: (text) => <span>{text || 'N/A'}</span> },
        { title: 'Total Exposure', dataIndex: 'TotalExposure', key: 'TotalExposure', render: (text) => <span>{text || 'N/A'}</span> },
        { title: 'Remarks', dataIndex: 'CRORemarks', key: 'CRORemarks', render: (text) => <span>{text || 'N/A'}</span> },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={dataHistory} pagination={false} rowKey={(record, index) => index} />
            {contextHolder}

            <FloatButton.Group shape="circle" style={{ right: 24, bottom: 24 }}>
                {isEdit ? (
                    <>
                        <FloatButton
                            className="bg-green-500"
                            icon={<SaveOutlined className="text-[#3b0764]" />}
                            tooltip="Save"
                            onClick={saveData}
                        />
                        <FloatButton
                            className="bg-red-500"
                            icon={<CloseOutlined />}
                            tooltip="Cancel"
                            onClick={toggleEditMode}
                        />
                    </>
                ) : (
                    <FloatButton
                        className="bg-[#3b0764] text-white"
                        icon={<EditOutlined className="text-[#1ad819]" />}
                        tooltip="Edit"
                        onClick={toggleEditMode}
                    />
                )}
            </FloatButton.Group>
        </div>
    );
}

export default AmountTable;
