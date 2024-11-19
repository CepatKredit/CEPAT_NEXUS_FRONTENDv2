import React, { useEffect, useState } from 'react';
import { Descriptions, ConfigProvider, Button, Tooltip } from 'antd';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


function ViewApprovalAmount({ data, loading, receive = () => {} }) {
    const [getMAmort, setMAmort] = useState(0);
    const [getTExposure, setTExposure] = useState(0);
    const token = localStorage.getItem('UTK');
    const decodedToken = token ? jwtDecode(token) : {};
    const recBy = decodedToken.USRID || ''; 

    useEffect(() => {
        receive({ name: 'RecBy', value: recBy });
    }, [recBy]);

    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const interestRate = data.ApprvInterestRate ? parseFloat(data.ApprvInterestRate) : 0;
        const terms = data.ApprvTerms ? parseInt(data.ApprvTerms) : 0;

        if (approvedAmount && interestRate && terms) {
            const calculatedAmort = ((((interestRate * terms) / 100) * approvedAmount) + approvedAmount) / terms;
            setMAmort(calculatedAmort || 0);
            receive({ name: 'MonthlyAmort', value: calculatedAmort || 0 });
        } else {
            setMAmort(0);
            receive({ name: 'MonthlyAmort', value: '0' });
        }
    }, [data.ApprvAmount, data.ApprvInterestRate, data.ApprvTerms]);

    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const otherExposure = data.OtherExposure ? parseFloat(data.OtherExposure.toString().replaceAll(',', '')) : 0;
        const calculatedTotal = approvedAmount + otherExposure;

        setTExposure(calculatedTotal ? calculatedTotal.toFixed(2) : '0.00');
        receive({ name: 'TotalExposure', value: calculatedTotal ? calculatedTotal.toFixed(2) : '0.00' });
    }, [data.ApprvAmount, data.OtherExposure]);

    const formatNumberWithCommas = (num) => {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const formatToTwoDecimalPlaces = (num) => {
        if (!num) return '';
        return parseFloat(num).toFixed(2);
    };

    const handleApprove = () => {
        console.log('Approval initiated with data:', data);
    };

    // Descriptions Items
    const items = [
        { key: '1', label: <span className={`font-semibold ${data.ApprvAmount ? 'text-black' : 'text-red-600'}`}>Approved Amount</span>, children: data.ApprvAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.ApprvAmount).replaceAll(',', ''))) : '' },
        { key: '2', label: <span className={`font-semibold ${data.ApprvInterestRate ? 'text-black' : 'text-red-600'}`}>Approved Interest Rate (%)</span>, children: data.ApprvInterestRate || '' },
        { key: '3', label: <span className={`font-semibold ${data.ApprvTerms ? 'text-black' : 'text-red-600'}`}>Approved Terms (Months)</span>, children: data.ApprvTerms || '' },
        { key: '4', label: <span className={`font-semibold ${getMAmort ? 'text-black' : 'text-red-600'}`}>Monthly Amort</span>, children: getMAmort ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(getMAmort))) : '' },
        { key: '5', label: <span className="font-semibold text-black">Other Exposure</span>, children: (data.OtherExposure !== undefined && data.OtherExposure !== null && data.OtherExposure !== '')
                ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.OtherExposure).replaceAll(',', '')))
                : '0.00' },
        { key: '6', label: <span className={`font-semibold ${getTExposure ? 'text-black' : 'text-red-600'}`}>Total Exposure</span>, children: getTExposure ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(getTExposure).replaceAll(',', ''))) : '' },
        { key: '7', label: <span className="font-semibold text-black">Remarks</span>, children: data.CRORemarks || '' },
        { key: '8', label: <span className="font-semibold text-black">Encoded By</span>, children: data.RecBy || recBy || '' },
        { key: '9', label: <span className="font-semibold text-black">Encoded Date</span>, children: data.RecDate ||  '' },
        { key: '10', label: <span className="font-semibold text-black">Approved By</span>, children: data.CremanBy || '' },
        { key: '11', label: <span className="font-semibold text-black">Approved Date</span>, children: data.CremanDate || '' },

    ];

    return (
        <div className="container mt-1 mx-auto p-10 bg-white rounded-xl shadow-lg w-[75vw]">
            <Descriptions
                title={<h2 className="text-2xl font-bold text-center mt-5">Approval Information</h2>}
                column={{ xs: 1, sm: 2, lg: 3 }}
                layout="horizontal"
            >
                {items.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <div className="flex justify-center mt-8">
                <ConfigProvider theme={{ token: { colorPrimary: '#2b972d' } }}>
                    <Tooltip title="Click to approve">
                        <Button
                            size="large"
                            className="bg-[#2b972d] text-white"
                            type="primary"
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
                    </Tooltip>
                </ConfigProvider>
            </div>
        </div>
    );
}

export default ViewApprovalAmount;
