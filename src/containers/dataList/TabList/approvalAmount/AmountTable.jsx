import React, { useEffect } from 'react';
import { Table, notification, Button } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function AmountTable({ data, receive, User, creditisEdit, loading }) {
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const [dataHistory, setDataHistory] = React.useState(data ? [{ ...data, TotalExposure: 0, MonthlyAmort: 0 }] : []);
    const [editableData, setEditableData] = React.useState(data || {}); 
    const [getTExposure, setTExposure] = React.useState(0);
    const [getMAmort, setMAmort] = React.useState(0);
    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const otherExposure = data.OtherExposure ? parseFloat(data.OtherExposure.toString().replaceAll(',', '')) : 0;
        const calculatedTotal = approvedAmount + otherExposure;

        setTExposure(calculatedTotal || 0);

        // Log calculations
        console.log("Approved Amount:", approvedAmount);
        console.log("Calculated Total Exposure:", calculatedTotal);
        setDataHistory((prevHistory) => {
            const updatedHistory = [{ ...data, TotalExposure: calculatedTotal, MonthlyAmort: getMAmort }];
            console.log("Updated dataHistory:", updatedHistory);
            return updatedHistory;
        });
    }, [data, getMAmort]);

    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const interestRate = data.ApprvInterestRate ? parseFloat(data.ApprvInterestRate) : 0;
        const terms = data.ApprvTerms ? parseInt(data.ApprvTerms) : 0;
    
        let calculatedAmort = 0;
        if (approvedAmount && interestRate && terms) {
            calculatedAmort = (((interestRate * terms) / 100 * approvedAmount) + approvedAmount) / terms;
            calculatedAmort = parseFloat(calculatedAmort.toFixed(2)); 
        }
    
        setMAmort(calculatedAmort);
        setDataHistory((prevHistory) => {
            const updatedHistory = prevHistory.map((entry) =>
                entry.ApprvAmount === data.ApprvAmount ? { ...entry, MonthlyAmort: calculatedAmort } : entry
            );
            return updatedHistory;
        });
    
        console.log("Calculated Monthly Amortization:", calculatedAmort);
    }, [data.ApprvAmount, data.ApprvInterestRate, data.ApprvTerms]);
    const toggleEditMode = () => {
        setEdit(!isEdit);
        setEditableData(data);
    };

    const handleInputChange = (name, value) => {
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const saveData = async () => {
        try {
            const response = await axios.post('/api/updateAmountTable', editableData);
            if (response.status === 200) {
                setDataHistory((prevHistory) => {
                    const newHistory = [...prevHistory, { ...editableData, TotalExposure: getTExposure, MonthlyAmort: getMAmort }];
                    console.log("Data history after save:", newHistory);
                    return newHistory;
                });

                receive(editableData);

                api.success({ message: 'Data saved successfully!' });
                setEdit(false); 
                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] });
            } else {
                api.error({ message: 'Failed to save data' });
            }
        } catch (error) {
            console.error("Error saving data:", error);
            api.error({ message: 'Error saving data' });
        }
    };
    const columns = [
        { 
            title: 'Approved Amount', 
            dataIndex: 'ApprvAmount', 
            key: 'ApprvAmount', 
            render: (text) => <span className="text-xs">{text || 'N/A'}</span> 
        },
        { 
            title: 'Interest Rate (%)', 
            dataIndex: 'ApprvInterestRate', 
            key: 'ApprvInterestRate', 
            render: (text) => <span className="text-xs">{text || 'N/A'}</span> 
        },
        { 
            title: 'Approved Terms', 
            dataIndex: 'ApprvTerms', 
            key: 'ApprvTerms', 
            render: (text) => <span className="text-xs">{text ? `${text} months` : 'N/A'}</span> 
        },
        { 
            title: 'Monthly Amortization', 
            dataIndex: 'MonthlyAmort', 
            key: 'MonthlyAmort', 
            render: (text) => <span className="text-xs">{text || 'N/A'}</span> 
        },
        { 
            title: 'Other Exposure', 
            dataIndex: 'OtherExposure', 
            key: 'OtherExposure', 
            render: (text) => <span className="text-xs">{text || 'N/A'}</span> 
        },
        { 
            title: 'Total Exposure', 
            dataIndex: 'TotalExposure', 
            key: 'TotalExposure', 
            render: (text) => <span className="text-xs">{text || 'N/A'}</span> 
        },
        { 
            title: 'Encoded By', 
            dataIndex: 'ModUser', 
            key: 'ModUser', 
            render: (text, record) => <span className="text-xs">{text || record.modUser || 'N/A'}</span> 
        },
        { 
            title: 'Approved By', 
            dataIndex: 'ModUser', 
            key: 'ModUser', 
            render: (text, record) => <span className="text-xs">{text || record.modUser || 'N/A'}</span> 
        },
        { 
            title: 'Remarks', 
            dataIndex: 'CRORemarks', 
            key: 'CRORemarks', 
            render: (text) => <span className="text-xs">{text || 'N/A'}</span> 
        },
        { 
            title: <span className="text-xs font-bold">Action</span>, 
            key: 'action', 
            render: (_, record) => (
                <Button 
                    type="primary" 
                    className="bg-green-500 border-none text-xs" 
                    onClick={() => handleApprove(record)}
                >
                    Approve
                </Button>
            ),
        },
    ];
    
    // Function to handle approve action
    const handleApprove = (record) => {
        // Add your approval logic here
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
