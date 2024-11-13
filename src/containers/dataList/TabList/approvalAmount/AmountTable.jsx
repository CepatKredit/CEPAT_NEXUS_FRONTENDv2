import React, { useState, useEffect } from 'react';
import { Table, notification, Button } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ResponsiveTable from '@components/global/ResponsiveTable';

function AmountTable({ data, receive, User, creditisEdit, loading }) {
    const [isEdit, setEdit] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const [dataHistory, setDataHistory] = useState([]);
    const [editableData, setEditableData] = useState({});
    const [getTExposure, setTExposure] = useState(0);
    const [getMAmort, setMAmort] = useState(0);

    useEffect(() => {
        console.log('test', data.loanIdCode);
        const fetchApprovalData = async () => {
            try {
                const response = await axios.get(`/getApproval/${data.loanIdCode}`);
                if (response.status === 200) {
                    const approvalData = response.data.list[0];
                    console.log("Fetched approval data:", approvalData);

                    setDataHistory([{
                        ...approvalData,
                        TotalExposure: approvalData.TotalExposure || 0,
                        MonthlyAmort: approvalData.MonthlyAmort || 0,
                    }]);
                    setEditableData(approvalData);
                } else {
                    console.error("Failed to fetch data:", response);
                    api.error({ message: 'Failed to fetch data from server' });
                }
            } catch (error) {
                console.error("Error fetching approval data:", error);
                api.error({ message: 'Error fetching approval data' });
            }
        };

        if (data.loanIdCode) fetchApprovalData();
    }, [data.loanIdCode]);

    useEffect(() => {
        const approvedAmount = parseFloat(editableData.ApprovedAmount?.toString().replaceAll(',', '') || 0);
        const otherExposure = parseFloat(editableData.OtherExposure?.toString().replaceAll(',', '') || 0);
        const calculatedTotal = approvedAmount + otherExposure;

        setTExposure(calculatedTotal);
        setDataHistory([{ ...editableData, TotalExposure: calculatedTotal, MonthlyAmort: getMAmort }]);
    }, [editableData, getMAmort]);

    useEffect(() => {
        const approvedAmount = parseFloat(editableData.ApprovedAmount?.toString().replaceAll(',', '') || 0);
        const interestRate = parseFloat(editableData.ApprvInterestRate || 0);
        const terms = parseInt(editableData.ApprovedTerms || 0);

        let calculatedAmort = 0;
        if (approvedAmount && interestRate && terms) {
            calculatedAmort = (((interestRate * terms) / 100 * approvedAmount) + approvedAmount) / terms;
            calculatedAmort = parseFloat(calculatedAmort.toFixed(2));
        }

        setMAmort(calculatedAmort);
        setDataHistory((prevHistory) => prevHistory.map(entry => 
            entry.ApprovedAmount === editableData.ApprovedAmount ? { ...entry, MonthlyAmort: calculatedAmort } : entry
        ));
    }, [editableData.ApprovedAmount, editableData.ApprvInterestRate, editableData.ApprovedTerms]);

    function formatNumberWithCommas(num) {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    function formatToTwoDecimalPlaces(num) {
        if (!num) return '';
        return parseFloat(num).toFixed(2);
    }
    const toggleEditMode = () => {
        setEdit(!isEdit);
    };

    const handleInputChange = (name, value) => {
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const columns = [
        { title: '#', dataIndex: 'num', key: 'num',width: '50px'},
        { title: 'Approved Amount', dataIndex: 'ApprovedAmount', key: 'ApprovedAmount', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: 'Interest Rate (%)', dataIndex: 'ApprvInterestRate', key: 'ApprvInterestRate', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: 'Approved Terms', dataIndex: 'ApprovedTerms', key: 'ApprovedTerms', render: (text) => <span className="text-xs">{text ? `${text} months` : ''}</span> },
        { title: 'Monthly Amortization', dataIndex: 'MonthlyAmort', key: 'MonthlyAmort', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: 'Other Exposure', dataIndex: 'OtherExposure', key: 'OtherExposure', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: 'Total Exposure', dataIndex: 'TotalExposure', key: 'TotalExposure', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: 'Encoded By', dataIndex: 'RecBy', key: 'RecBy', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: 'Approved By', dataIndex: 'CremanBy', key: 'CremanBy', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: 'Remarks', dataIndex: 'CroRemarks', key: 'CroRemarks', render: (text) => <span className="text-xs">{text || ''}</span> },
        { title: <span className="text-xs font-bold">Action</span>, key: 'action', render: (_, record) => (
            <Button type="primary" className="bg-green-500 border-none text-xs" onClick={() => handleApprove(record)}>
                Approve
            </Button>
        ) }
    ];

    const handleApprove = (record) => {
        console.log('Approved record:', record);
    };

    return (
        <div>
            <ResponsiveTable 
                columns={columns} 
                rows={dataHistory.map((item, index) => ({
                    key: index,
                    num: index + 1,
                    ApprovedAmount: item.approvedAmount
                        ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(item.approvedAmount).replaceAll(',', '')))
                        : '0.00',
                    ApprvInterestRate: item.apprvInterestRate || '',
                    ApprovedTerms: item.approvedTerms ? `${item.approvedTerms}` : '',
                    MonthlyAmort: item.monthlyAmort
                        ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(item.monthlyAmort)))
                        : '0.00',
                    OtherExposure: item.otherExposure !== undefined && item.otherExposure !== null && item.otherExposure !== ''
                        ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(item.otherExposure).replaceAll(',', '')))
                        : '0.00',
                    TotalExposure: item.totalExposure
                        ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(item.totalExposure).replaceAll(',', '')))
                        : '0.00',
                    RecBy: item.recBy || '',
                    CremanBy: item.cremanBy || '',
                    CroRemarks: item.croRemarks || ''
                }))}
                locale={dataHistory.length === 0 ? { emptyText: 'Empty' } : {}}
                pagination={false} 
                rowKey={(record) => record.key} 
            />
            {contextHolder}
        </div>
    );
}

export default AmountTable;
