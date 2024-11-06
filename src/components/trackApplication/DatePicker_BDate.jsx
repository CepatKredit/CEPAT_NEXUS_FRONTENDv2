
import * as React from 'react';
import { DatePicker, Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import dayjs from 'dayjs';
import { mmddyy } from '@utils/Converter';

function DatePicker_BDay({ required, placeHolder, label, value, receive, disabled, category, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value ? dayjs(value) : null;

    function onDateChange(date) {
        getItem = date
        const calculatedAge = calculateAge(date);
        setIcon(false)
        if (calculatedAge < 20) {
            setStatus('error')
            setIcon(true)
            receive()
        } else {
            setStatus('')
            setIcon(true)
            receive(date);
        }
    }

    function onBlur() {
        setIcon(true)
        const calculatedAge = calculateAge(getItem);

        if (!getItem || calculatedAge < 20) { setStatus('error') }
        else { setStatus('') }
    }

    function calculateAge(birthday) {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }


    return (

        <div className={className_dmain}>
            {category === 'marketing'
                ? (<div>
                    <label className={className_label}>{label}</label>
                </div>)
                : category === "direct"
                    ? (<label className={className_label}>{label}</label>)
                    : null}

            <div className={className_dsub}>
                {
                    disabled
                        ? (<Input
                            readOnly={disabled}
                            className={`w-full ${disabled ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                            value={mmddyy(value)}
                            size='large'
                            placeholder={placeHolder}
                            autoComplete='off'
                            style={{ width: '100%' }}
                        />)
                        : (<DatePicker
                            format={'MM-DD-YYYY'}
                            allowClear
                            className={`w-full ${disabled ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                            value={getItem || undefined}
                            size='large'
                            placeholder={placeHolder}
                            onChange={(_, e) => { onDateChange(e) }}
                            onBlur={(e) => { onBlur(e) }}
                            disabled={disabled}
                            status={!disabled && (required || required === undefined) ? getStatus : false}
                            style={{ width: '100%' }}
                            suffixIcon={
                                !disabled && (required || required === undefined) ? (
                                    getIcon === true
                                        ? getStatus === 'error'
                                            ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                            : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                                        : (<></>)) : (<></>)
                            }
                        />)
                }
                {
                    !disabled && (required || required === undefined) ? (
                        getStatus === 'error'
                            ? (<div className='text-xs text-red-500 pt-1 pl-2'>
                                {placeHolder + " Required (Must be atleast 20 Years Old)"}
                            </div>)
                            : (<></>)) : (<></>)
                }

            </div>
        </div>
    )

}

export default DatePicker_BDay;
