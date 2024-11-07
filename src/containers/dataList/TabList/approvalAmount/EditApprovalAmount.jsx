import React, { useEffect, useState } from 'react';
import { Flex, Input } from 'antd';
import LabeledCurrencyInput from '@components/marketing/LabeledCurrencyInput';
import LabeledSelect from '@components/marketing/LabeledSelect';
import LabeledTextArea from '@components/marketing/LabeledTextArea';
import LabeledInput from '@components/marketing/LabeledInput';
import AmountTable from './AmountTable';
import { jwtDecode } from 'jwt-decode';

function EditApprovalAmount({ data, receive }) {
    const inputRef = React.useRef(null); 
    const [getMAmort, setMAmort] = React.useState(0);
    const [getTExposure, setTExposure] = React.useState(0);

    const rendered = true;

    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const interestRate = data.ApprvInterestRate ? parseFloat(data.ApprvInterestRate) : 0;
        const terms = data.ApprvTerms ? parseInt(data.ApprvTerms) : 0;
        if (approvedAmount && interestRate && terms) {
            const calculatedAmort = ((((interestRate * terms)/100) * approvedAmount) + approvedAmount) / terms;
            setMAmort(calculatedAmort || 0);
        } else {
            setMAmort(0);
        }
    }, [data.ApprvAmount, data.ApprvInterestRate, data.ApprvTerms]);

    useEffect(() => {
        const approvedAmount = data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0;
        const otherExposure = data.OtherExposure ? parseFloat(data.OtherExposure.toString().replaceAll(',', '')) : 0;
        const calculatedTotal = approvedAmount + otherExposure;
        if(approvedAmount === 0 || otherExposure === 0){
            setTExposure(0);
        } else {
            setTExposure(calculatedTotal || 0);
        }
    }, [data.ApprvAmount, data.OtherExposure]);

    const token = localStorage.getItem('UTK');
    const decodedToken = token ? jwtDecode(token) : {};
    const modUser = decodedToken.USRID || ''; // Retrieve user ID or set as empty string if unavailable

    useEffect(() => {
        receive({ name: 'ModUser', value: modUser });
    }, [modUser]);

    return (
<div className="flex flex-col gap-8 mt-5 md:flex-row md:gap-5 lg:gap-12 h-[27rem] overflow-y-auto border rounded-md p-4">
{/* Left Column: Table */}
            <div className="w-full md:w-2/3 lg:w-3/4 p-1">
                <AmountTable data={data} receive={receive} User="Credit" creditisEdit={false} loading={false} />
            </div>
            {/* Right Column: Form Fields */}
            <div className="w-full md:w-1/3 lg:w-1/4 p-1">
                <div className="grid grid-cols-1 gap-1">
                    <LabeledCurrencyInput
                        className_dmain="w-full"
                        className_label="font-bold text-sm "
                        value={data.ApprvAmount}
                        receive={(e) => receive({ name: 'ApprvAmount', value: e })}
                        label={<span>Approved Amount <span className="text-red-500">*</span></span>}
                        placeHolder="Enter Approved Amount"
                        category="marketing"
                        rendered={rendered}
                    />
                    <LabeledCurrencyInput
                        className_dmain="w-full"
                        className_label="font-bold text-sm "
                        value={data.ApprvInterestRate}
                        receive={(e) => receive({ name: 'ApprvInterestRate', value: e })}
                        label={<span>Approved Interest Rate (%) <span className="text-red-500">*</span></span>}
                        placeHolder="Enter Interest Rate"
                        category="marketing"
                        rendered={rendered}
                    />
                     <LabeledSelect
                        className_dmain="w-full"
                        className_label="font-bold text-sm"
                        label={<span>Approved Terms <span className="text-red-500">*</span></span>}
                        value={data.ApprvTerms}
                        data={Array.from({ length: 22 }, (_, i) => ({ value: i + 3, label: `${i + 3} months` }))}
                        receive={(e) => receive({ name: 'ApprvTerms', value: e })}
                        placeHolder="Select Approved Terms"
                        rendered={rendered}
                    />
                    <LabeledCurrencyInput
                        className_dmain="w-full"
                        className_label="font-bold text-sm "
                        value={data.MonthlyAmort}
                        receive={(e) => receive({ name: 'MonthlyAmort', value: e })}
                        label={<span>Monthly Amort <span className="text-red-500">*</span></span>}
                        placeHolder="Calculated Monthly Amortization"
                        readOnly
                        category="marketing"
                        rendered={rendered}
                        calculated_val={getMAmort}
                    />
                    <LabeledCurrencyInput
                        className_dmain="w-full"
                        className_label="font-bold text-sm "
                        value={data.OtherExposure}
                        receive={(e) => receive({ name: 'OtherExposure', value: e })}
                        label="Other Exposure"
                        placeHolder="Enter Other Exposure"
                        category="marketing"
                        rendered={rendered}
                        required={false}
                    />
                    <LabeledCurrencyInput
                        className_dmain="w-full"
                        className_label="font-bold text-sm "
                        value={data.TotalExposure}
                        receive={(e) => receive({ name: 'TotalExposure', value: e })}
                        label={<span>Total Exposure <span className="text-red-500">*</span></span>}
                        placeHolder="Calculated Total Exposure"
                        readOnly
                        category="marketing"
                        rendered={rendered}
                        calculated_val={getTExposure}
                    />
                    <div className="w-full">
                        <label className="font-bold text-sm ">Remarks</label>
                        <Input.TextArea
                            className="w-full border-gray-300 rounded-md text-sm"
                            value={data.CRORemarks}
                            onChange={(e) => receive({ name: 'CRORemarks', value: e.target.value.toUpperCase() })}
                            placeholder="Enter remarks here"
                            style={{ height: '5rem', resize: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditApprovalAmount;