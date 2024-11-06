import React, { useEffect, useState } from 'react';
import { Descriptions, ConfigProvider, Spin } from 'antd';
import { jwtDecode } from 'jwt-decode';


function ViewApprovalAmount({ data, loading, receive }) { 

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
    const token = localStorage.getItem('UTK');
    const decodedToken = token ? jwtDecode(token) : {};
    const modUser = decodedToken.USRID || ''; 

    useEffect(() => {
        if (receive) {
            receive({ name: 'ModUser', value: modUser });
        }
    }, [modUser]);

    const items = [
        { key: '1', label: <span className="font-semibold text-black">Approved Amount</span>, children: data.ApprvAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.ApprvAmount).replaceAll(',', ''))) : '' },
        { key: '2', label: <span className="font-semibold text-black">Approved Interest Rate (%)</span>, children: data.ApprvInterestRate || '' },
        { key: '3', label: <span className="font-semibold text-black">Approved Terms (Months)</span>, children: data.ApprvTerms || '' },
        { key: '4', label: <span className="font-semibold text-black">Monthly Amort</span>, children: data.MonthlyAmort ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.MonthlyAmort).replaceAll(',', ''))) : '' },
        { key: '5', label: <span className="font-semibold text-black">Other Exposure</span>, children: data.OtherExposure ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.OtherExposure).replaceAll(',', ''))) : '' },
        { key: '6', label: <span className="font-semibold text-black">Total Exposure</span>, children: data.TotalExposure ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.TotalExposure).replaceAll(',', ''))) : '' },
        { key: '8', label: <span className="font-semibold text-black">Approved By</span>, children: data.ModUser || modUser || '' },
        { key: '7', label: <span className="font-semibold text-black">Remarks</span>, children: data.CRORemarks || '' },
    ];

    return (
        <div className="container mt-1 mx-auto p-10 bg-white rounded-xl shadow-lg w-[75vw]">
            <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                <Spin spinning={loading} tip="Please wait..." className="flex justify-center items-center">
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
                </Spin>
            </ConfigProvider>
        </div>
    );
}

export default ViewApprovalAmount;
