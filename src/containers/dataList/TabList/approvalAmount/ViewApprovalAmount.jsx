import React, { useEffect, useState } from 'react';
import { Descriptions, ConfigProvider, Spin } from 'antd';
import { jwtDecode } from 'jwt-decode';

function ViewApprovalAmount({ data, loading, receive = () => {} }) {
    const [getMAmort, setMAmort] = React.useState(0);
    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const interestRate = data.ApprvInterestRate ? parseFloat(data.ApprvInterestRate) : 0;
        const terms = data.ApprvTerms ? parseInt(data.ApprvTerms) : 0;
        if (approvedAmount && interestRate && terms) {
            const calculatedAmort = ((((interestRate * terms)/100) * approvedAmount) + approvedAmount) / terms;
            setMAmort(calculatedAmort || 0);
            receive({ name: 'MonthlyAmort', value: calculatedAmort || 0 })
        } else {
            setMAmort(0);
            receive({ name: 'MonthlyAmort', value: '0' })
        }
    }, [data.ApprvAmount, data.ApprvInterestRate, data.ApprvTerms]);
    const [getTExposure, setTExposure] = React.useState(0);
    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const otherExposure = data.OtherExposure ? parseFloat(data.OtherExposure.toString().replaceAll(',', '')) : 0;
        const calculatedTotal = approvedAmount + otherExposure;
        if (approvedAmount === 0) {
            setTExposure("0.00");
            receive({ name: 'TotalExposure', value: '0.00' }) 
        } else {
            setTExposure(calculatedTotal ? calculatedTotal.toFixed(2) : "0.00");
            receive({ name: 'TotalExposure', value: calculatedTotal ? calculatedTotal.toFixed(2) : "0.00" }) 
        }
    }, [data.ApprvAmount, data.OtherExposure]);


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
    {/*const token = localStorage.getItem('UTK');
    const decodedToken = token ? jwtDecode(token) : {};
    const modUser = decodedToken.USRID || ''; 

    useEffect(() => {
        if (receive) {
            receive({ name: 'ModUser', value: modUser });
        }
    }, [modUser]);*/}

    const items = [
        { key: '1', label: <span className={`font-semibold ${data.ApprvAmount ? 'text-black' : 'text-orange-500'}`}>Approved Amount</span>, children: data.ApprvAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.ApprvAmount).replaceAll(',', ''))) : '' },
        { key: '2', label: <span className={`font-semibold ${data.ApprvInterestRate ? 'text-black' : 'text-orange-500'}`}>Approved Interest Rate (%)</span>, children: data.ApprvInterestRate || '' },
        { key: '3', label: <span className={`font-semibold ${data.ApprvTerms ? 'text-black' : 'text-orange-500'}`}>Approved Terms (Months)</span>, children: data.ApprvTerms || '' },
        { key: '4', label: <span className={`font-semibold ${getMAmort ? 'text-black' : 'text-orange-500'}`}>Monthly Amort</span>, children: getMAmort ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(getMAmort))) : ''},
        { key: '5', label: <span className="font-semibold text-black">Other Exposure</span>, children: (data.OtherExposure !== undefined && data.OtherExposure !== null && data.OtherExposure !== '')
                ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.OtherExposure).replaceAll(',', '')))
                : '0.00'},        
        { key: '6', label: <span className={`font-semibold ${getTExposure ? 'text-black' : 'text-orange-500'}`}>Total Exposure</span>, children: getTExposure ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(getTExposure).replaceAll(',', ''))) : '' },
        { key: '7', label: <span className="font-semibold text-black">Remarks</span>, children: data.CRORemarks || '' },
        { /*key: '8', label: <span className={`font-semibold ${data.ModUser || modUser ? 'text-black' : 'text-orange-500'}`}>Approved By</span>, children: data.ModUser || modUser || '' */},

    ];

    return (
        <div className="container mt-1 mx-auto p-10 bg-white rounded-xl shadow-lg w-[75vw]">
                    <Descriptions title={<h2 className="text-2xl font-bold text-center mt-5">Approval Information</h2>}
                        column={{ xs: 1, sm: 2, lg: 3 }}
                        layout="horizontal"
                    >
                        {items.map((item) => (
                            <Descriptions.Item key={item.key} label={item.label}>
                                {item.children}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
        </div>
    );
}

export default ViewApprovalAmount;
