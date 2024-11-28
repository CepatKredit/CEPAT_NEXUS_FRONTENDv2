import React, { useState, useEffect } from 'react';
import { Select, ConfigProvider, Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { toUpperText } from '@utils/Converter';

function LabeledSelect({ rendered, required, showSearch, placeHolder, label, data, value, receive, readOnly, disabled, category, className_dmain, className_label, className_dsub }) {
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
        if (rendered) {
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
                <ConfigProvider theme={{
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
                        value={getItem || undefined}
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
                </ConfigProvider>

            </div>
        </div>
    );
}

export default LabeledSelect;
