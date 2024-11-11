import React, { useState, useEffect } from 'react';
import { Table, notification, Button } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function AmountTable({ data, receive, User, creditisEdit, loading }) {
    const [isEdit, setEdit] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const [dataHistory, setDataHistory] = useState(data ? [{ ...data, TotalExposure: 0, MonthlyAmort: 0 }] : []);
    const [editableData, setEditableData] = useState(data || {}); 
    const [getTExposure, setTExposure] = useState(0);
    const [getMAmort, setMAmort] = useState(0);

    // Calculate Total Exposure based on Approved Amount and Other Exposure
    useEffect(() => {
        const approvedAmount = parseFloat(data.ApprvAmount?.toString().replaceAll(',', '') || 0);
        const otherExposure = parseFloat(data.OtherExposure?.toString().replaceAll(',', '') || 0);
        const calculatedTotal = approvedAmount + otherExposure;

        setTExposure(calculatedTotal);
        setDataHistory([{ ...data, TotalExposure: calculatedTotal, MonthlyAmort: getMAmort }]);
        
        console.log("Calculated Total Exposure:", calculatedTotal);
    }, [data, getMAmort]);

    // Calculate Monthly Amortization based on Approved Amount, Interest Rate, and Terms
    useEffect(() => {
        const approvedAmount = parseFloat(data.ApprvAmount?.toString().replaceAll(',', '') || 0);
        const interestRate = parseFloat(data.ApprvInterestRate || 0);
        const terms = parseInt(data.ApprvTerms || 0);

        let calculatedAmort = 0;
        if (approvedAmount && interestRate && terms) {
            calculatedAmort = (((interestRate * terms) / 100 * approvedAmount) + approvedAmount) / terms;
            calculatedAmort = parseFloat(calculatedAmort.toFixed(2));
        }

        setMAmort(calculatedAmort);
        setDataHistory((prevHistory) => prevHistory.map(entry => 
            entry.ApprvAmount === data.ApprvAmount ? { ...entry, MonthlyAmort: calculatedAmort } : entry
        ));

        console.log("Calculated Monthly Amortization:", calculatedAmort);
    }, [data.ApprvAmount, data.ApprvInterestRate, data.ApprvTerms]);

    // Toggle edit mode
    const toggleEditMode = () => {
        setEdit(!isEdit);
        setEditableData(data);
    };

    // Handle input change for editable data
    const handleInputChange = (name, value) => {
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Save data to the server and update local state
    const saveData = async () => {
        try {
            const response = await axios.post('/api/updateAmountTable', editableData);
            if (response.status === 200) {
                setDataHistory((prevHistory) => [
                    ...prevHistory,
                    { ...editableData, TotalExposure: getTExposure, MonthlyAmort: getMAmort }
                ]);

                receive(editableData);
                api.success({ message: 'Data saved successfully!' });
                setEdit(false);
                queryClient.invalidateQueries(['ClientDataListQuery']);
            } else {
                api.error({ message: 'Failed to save data' });
            }
        } catch (error) {
            console.error("Error saving data:", error);
            api.error({ message: 'Error saving data' });
        }
    };

    // Columns configuration for the table
    const columns = [
        { title: 'Approved Amount', dataIndex: 'ApprvAmount', key: 'ApprvAmount', render: (text) => <span className="text-xs">{'' || ''}</span> },
        { title: 'Interest Rate (%)', dataIndex: 'ApprvInterestRate', key: 'ApprvInterestRate', render: (text) => <span className="text-xs">{'' || ''}</span> },
        { title: 'Approved Terms', dataIndex: 'ApprvTerms', key: 'ApprvTerms', render: (text) => <span className="text-xs">{'' ? `${''} months` : ''}</span> },
        { title: 'Monthly Amortization', dataIndex: 'MonthlyAmort', key: 'MonthlyAmort', render: (text) => <span className="text-xs">{'' || ''}</span> },
        { title: 'Other Exposure', dataIndex: 'OtherExposure', key: 'OtherExposure', render: (text) => <span className="text-xs">{'' || ''}</span> },
        { title: 'Total Exposure', dataIndex: 'TotalExposure', key: 'TotalExposure', render: (text) => <span className="text-xs">{'' || ''}</span> },
        { title: 'Encoded By', dataIndex: 'ModUser', key: 'ModUser', render: (text, record) => <span className="text-xs">{'' || record.modUser || ''}</span> },
        { title: 'Approved By', dataIndex: 'ModUser', key: 'ModUser', render: (text, record) => <span className="text-xs">{'' || record.modUser || ''}</span> },
        { title: 'Remarks', dataIndex: 'CRORemarks', key: 'CRORemarks', render: (text) => <span className="text-xs">{'' || ''}</span> },
        { title: <span className="text-xs font-bold">Action</span>, key: 'action', render: (_, record) => (
            <Button type="primary" className="bg-green-500 border-none text-xs" onClick={() => handleApprove(record)}>
                Approve
            </Button>
        )}
    ];

    // Handle approve action (for future implementation)
    const handleApprove = (record) => {
        console.log('Approved record:', record);
    };
    
    return (
        <div>
            <Table columns={columns} dataSource={dataHistory} pagination={false} rowKey={(record, index) => index} />
            {contextHolder}
        </div>
    );
}

export default AmountTable;
