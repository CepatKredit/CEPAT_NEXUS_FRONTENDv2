import { DatePicker, Input, Tooltip } from 'antd';  // Import Tooltip
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { mmddyy } from '@utils/Converter';
import React, { useEffect, useState } from 'react';

function DatePicker_BDay({rendered, required, placeHolder, label, value, receive, disabled, readOnly, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = useState('');
  const [getIcon, setIcon] = useState(false);
  let getitem  = value? dayjs(value) : '';

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const onDateChange = (date) => {
    getitem = date;
    const calculatedAge = calculateAge(date);
    setIcon(true);
    if (isNaN(calculatedAge) || (calculatedAge >= 20 && calculatedAge <= 65)) {
      setStatus('');
      receive(date); // Pass valid date to parent
    } else {
      setStatus('error');
      receive(); // Pass empty or error state to parent
    }
  };

  const isDateTimeValid = (dateStr) => {
    return dayjs(dateStr).isValid();
  };

  React.useEffect(() => {
    if(rendered ){
        const calculatedAge = calculateAge(value? value: '');
        setIcon(true);
        if ((calculatedAge >= 20 && calculatedAge <= 65)) {
          setStatus('');
        } else {
          setStatus('error');
        }    
      }
}, [value]);


    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>

            <div className={className_dsub}>
        <DatePicker
          allowClear
          value={getitem && isDateTimeValid(getitem) ? getitem : null}
          disabled={disabled}
          size="large"
          placeholder={placeHolder}
          onChange={onDateChange}
          //onBlur={onBlur}
          readOnly={readOnly}
          status={getStatus}
          style={{ width: '100%' }}
          suffixIcon={
            getIcon ? (
              getStatus === 'error' ? (
                <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
              ) : (
                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
              )
            ) : null
          }
          format={'MM-DD-YYYY'}
        />
        {getStatus === 'error' && (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {label!='Contract Date'? 'Required (Min. 20 Years Old and Max. 65 Years Old)' : `${label} Required`}
          </div>
        )}
      </div>
    </div>
    )
}

export default DatePicker_BDay;
