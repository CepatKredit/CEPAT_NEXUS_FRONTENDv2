import React, { useState, useEffect } from 'react';
import { Select, ConfigProvider, Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { toUpperText } from '@utils/Converter';

function LabeledSelect({rendered, required, showSearch, placeHolder, label, data, value, receive, readOnly, disabled, category, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value || '';

   
    function onChange(e) {
        getItem = e
        if (!e) {
            receive()
            setStatus('error')
            setIcon(true)
        }
        else {
            receive(e)
            setStatus('')
            setIcon(true)
        }
    }
   
    function onBlur(e) {
        setIcon(true)
        if (!getItem) { setStatus('error') }
        else { setStatus('') }
    }
    React.useEffect(() => {
        if(rendered){
            setIcon(false)
            if (!getItem) {
                setStatus('error')
                setIcon(true)
            }
            else {
                setStatus('')
                setIcon(true)
            }
        }
    }, [value]);


    return (
        <div className={className_dmain}>
          <div>
                    <label className={className_label}>{label}</label>
                </div>
            <div className={className_dsub}>
                {disabled
                    ? (<Input
                        readOnly={disabled}
                        className={`w-full ${disabled ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                        value={
                            !selectedValue 
                                ? '' 
                                : toUpperText(label) === 'GENDER'
                                    ? getItem === 1 
                                        ? 'Male' 
                                        : 'Female'
                                    : toUpperText(label) === 'TYPE OF RESIDENCES'
                                        ? getItem === 1 
                                            ? 'Owned House' 
                                            : getItem === 2 
                                                ? 'Mortgaged'
                                                : getItem === 3 
                                                    ? 'Renting' 
                                                    : 'Used Free'
                                                    : toUpperText(label) === 'MARITAL STATUS'
                                                    ? getItem === 1 
                                                        ? 'Single' 
                                                        : getItem === 2 
                                                            ? 'Married'
                                                            : getItem === 3 
                                                                ? 'Widowed' 
                                                                : getItem === 4 
                                                                    ? 'Separated'
                                                                    : getItem === 5 
                                                                        ? 'Common Law' 
                                                                        : 'Live in Partner'
                                                                            : toUpperText(label) === 'LOAN APPLICATION TYPE (NEW, RENEWAL, DORMANT)'
                                                                            ? getItem === 1
                                                                                ? 'NEW'
                                                                                    : getItem === 2
                                                                                        ? 'RENEWAL'
                                                                                        : 'DORMANT'
                                                                                        : toUpperText(label) === 'HOW DID YOU KNOW ABOUT CEPAT KREDIT FINANCING?'
                                                                                        ? getItem === 1 
                                                                                            ? 'Tiktok'
                                                                                            : getItem === 2 
                                                                                                ? 'YouTube'
                                                                                                : getItem === 3 
                                                                                                    ? 'Influencer'
                                                                                                    : getItem === 4 
                                                                                                        ? 'Cepat Website'
                                                                                                        : getItem === 5 
                                                                                                            ? 'Flyer'
                                                                                                            : getItem === 6 
                                                                                                                ? 'Branch Tarpaulin'
                                                                                                                : getItem === 7 
                                                                                                                    ? 'Lamp Post Banner'
                                                                                                                    : getItem === 8 
                                                                                                                        ? 'SMS/Text Messages'
                                                                                                                        : getItem === 9 
                                                                                                                            ? 'Client Referral'
                                                                                                                            : getItem === 10 
                                                                                                                                ? 'Loan Consultant/Referral'
                                                                                                                                : getItem === 11 
                                                                                                                                    ? 'Internet'
                                                                                                                                    : getItem === 12 
                                                                                                                                        ? 'Events'
                                                                                                                                        : getItem === 13 
                                                                                                                                            ? 'Blogs/Articles'
                                                                                                                                            : getItem === 14 
                                                                                                                                                ? 'Asialink Finance Referral'
                                                                                                                                                : 'Facebook'
                                                                                                                                                : toUpperText(label) === 'LOAN TERMS (IN MONTHS)'
                                                                                                                                                ? getItem
                                                                                                                    
                                                    : toUpperText(label) === 'HIGHEST EDUCATIONAL ATTAINMENT'
                                                        ? getItem
                                                        : ''
                                                        
                        }
                        
                        size="large"
                        placeholder={placeHolder}
                        autoComplete="off"
                        style={{ width: '100%' }}
                    />
                    
                    ) : (<ConfigProvider theme={{
                        components: {
                            Select: {
                                colorBgContainer: disabled ? '#f5f5f5' : '#ffffff',
                            },
                        },
                    }}>

                        <Select
                            options={data?.map(x => ({
                                value: x.value,
                                label: typeof x.label === 'string' ? x.label.toUpperCase() : x.label
                            }))}
                            disabled={disabled}
                            value={getItem  || undefined}
                            className='w-full text-left'
                            size='large'
                            placeholder={placeHolder}
                            onChange={(e) => { onChange(e) }}
                            //onBlur={(e) => { onBlur(e) }}
                            showSearch 
                            filterOption={(input, option) => {
                                const lowerCaseInput = input.toLowerCase();
                                const optionLabel = option.label.toString().toLowerCase();
                                
                                return (
                                    optionLabel.includes(lowerCaseInput) ||
                                    option.value.toString().includes(input)
                                );
                            }}   
                            status={!disabled && (required || required == undefined) ? getStatus : null}
                            style={{ width: '100%' }}
                            suffixIcon={
                                !disabled && (required || required == undefined) ? (
                                    getIcon === true
                                        ? getStatus === 'error'
                                            ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                            : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                                        : (<></>)) : (<></>)
                            }
                        />
                        {
                            !disabled && (required || required == undefined) ? (
                                getStatus === 'error'
                                    ? (<div className='text-xs text-red-500 pt-1 pl-2'>
                                        {placeHolder !== 'Please Select...' ? `${placeHolder} Required` : `Required`}
                                    </div>)
                                    : (<></>)) : (<></>)
                        }
                    </ConfigProvider>)
                }
            </div>
        </div>
    );
}

export default LabeledSelect;
