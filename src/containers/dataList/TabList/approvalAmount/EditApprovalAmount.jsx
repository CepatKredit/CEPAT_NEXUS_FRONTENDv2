import React, { useEffect, useState } from 'react';
import { Flex } from 'antd';
import LabeledCurrencyInput from '@components/marketing/LabeledCurrencyInput';
import LabeledSelect from '@components/marketing/LabeledSelect';
import LabeledTextArea from '@components/marketing/LabeledTextArea';
import LabeledInput from '@components/marketing/LabeledInput';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { jwtDecode } from 'jwt-decode';

function EditApprovalAmount({ data, receive }) {
    const [getMAmort, setMAmort] = React.useState(0);
    const [getTExposure, setTExposure] = React.useState(0);
    const { updateAppDetails } = React.useContext(LoanApplicationContext)

    const rendered = true;
    const monthsOptions = [];
    for (let i = 3; i <= 24; i++) {
        monthsOptions.push({ value: i, label: `${i} months` });
    }

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

    const token = localStorage.getItem('UTK');
    const decodedToken = token ? jwtDecode(token) : {};
    const recBy = decodedToken.USRID || ''; 
    useEffect(() => {
        receive({ 
            RecBy: recBy});
    }, [recBy,receive]);

    return (
        <Flex className="w-full  mt-5" justify="center" gap="small" wrap>

            <LabeledCurrencyInput
                className_dmain={'mt-10 w-[400px] h-[4rem] pt-[.4rem]'}
                className_label="font-bold"
                value={data.ApprvAmount}
                receive={(e) => updateAppDetails({ name: 'ApprvAmount', value: e })}
                label={<>Approved Amount <span className="text-red-500">*</span></>}
                placeHolder="Enter Approved Amount"
                category={'marketing'}
                rendered={rendered}
            />
            <LabeledCurrencyInput
                className_dmain="mt-10 w-[400px] h-[4rem] pt-[.4rem]"
                className_label="font-bold"
                value={data.ApprvInterestRate}
                receive={(e) => updateAppDetails({ name: 'ApprvInterestRate', value: e })}
                label={<>Approved Interest Rate (%) <span className="text-red-500">*</span></>}
                placeHolder="Enter Interest Rate"
                category="marketing"
                rendered={rendered}
            />

            <LabeledSelect
                className_dmain={'mt-10 w-[400px] h-[4rem] pt-[.4rem]'}
                className_label="font-bold"
                label={<>Approved Terms <span className="text-red-500">*</span></>}
                value={data.ApprvTerms}
                data={Array.from({ length: 22 }, (_, i) => ({ value: i + 3, label: `${i + 3} months` }))}
                receive={(e) => {
                    updateAppDetails({
                        name: 'ApprvTerms',
                        value: e,
                    });
                }}
                placeHolder={'Select Approved Terms'}
                rendered={rendered}
            />
            <LabeledCurrencyInput
                className_dmain="mt-10 w-[400px] h-[4rem] pt-[.4rem]"
                className_label="font-bold"
                value={data.MonthlyAmort}
                receive={(e) => updateAppDetails({ name: 'MonthlyAmort', value: e })}
                label={<>Monthly Amort <span className="text-red-500">*</span></>}
                placeHolder="Calculated Monthly Amortization"
                readOnly
                category="marketing"
                rendered={rendered}
                calculated_val={getMAmort}
            />

            <LabeledCurrencyInput
                className_dmain={'mt-10 w-[400px] h-[4rem] pt-[.4rem]'}
                className_label="font-bold"
                value={data.OtherExposure}
                receive={(e) => updateAppDetails({ name: 'OtherExposure', value: e })}
                label="Other Exposure"
                placeHolder="Enter Other Exposure"
                category={'marketing'}
                rendered={rendered}
                required={false}
            />
            <LabeledCurrencyInput
                className_dmain="mt-10 w-[400px] h-[4rem] pt-[.4rem]"
                className_label="font-bold"
                value={data.TotalExposure}
                receive={(e) => updateAppDetails({ name: 'TotalExposure', value: e })}
                label={<>Total Exposure <span className="text-red-500">*</span></>}
                placeHolder="Calculated Total Exposure"
                readOnly
                category="marketing"
                rendered={rendered}
                calculated_val={getTExposure}
            />
            <LabeledInput
                className_dmain={'mt-10 w-[400px] h-[4rem] pt-[.4rem]'}
                className_label={'font-bold'}
                label={'Encoded By'}
                placeHolder="Encoded By"
                value={data.RecBy || recBy}
                receive={(e) => updateAppDetails({ name: 'ModUser', value: e })}
                category="marketing"
                rendered={rendered}
                readOnly
            />
            <LabeledInput
                className_dmain={'mt-10 w-[400px] h-[4rem] pt-[.4rem]'}
                className_label={'font-bold'}
                label={'Approved By'}
                placeHolder="Approved By"
                value={data.CremanBy}
                receive={(e) => updateAppDetails({ name: 'ModUser', value: e })}
                category="marketing"
                rendered={rendered}
                readOnly
            />
            <div className="mt-10 w-[500px] h-[3rem] pt-[.1rem]">
                <label className="font-bold">Remarks</label>
                <LabeledTextArea
                    className="w-full border-gray-300 rounded-md"
                    value={data.CRORemarks}
                    receive={(e) => {
                        receive({
                            name: 'CRORemarks',
                            value: e,
                        });
                    }}
                    placeholder="Enter remarks here"
                    style={{ height: '8rem', resize: 'none' }}
                />
            </div>
           
            {/* 
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={data.CRORemarks}
                    onChange={(e) => receive(e.target.value)}
                    placeholder={"Enter remarks here"}
                    style={{ height: '8rem', resize: 'none' }} />*/}
        </Flex>
    );
}

export default EditApprovalAmount;