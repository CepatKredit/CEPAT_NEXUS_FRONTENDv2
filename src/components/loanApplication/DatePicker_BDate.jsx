import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function DatePicker_BDay({
  placeHolder,
  label,
  value,
  receive,
  disabled,
  readOnly,
  category,
  className_dmain,
  className_label,
  className_dsub,
  rendered,
  fieldName,
}) {

  const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext);

  const [getStatus, setStatus] = React.useState('');
  const [getIcon, setIcon] = React.useState(false);
  let getitem  =  dayjs(getAppDetails[fieldName]) || '';

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
    if (isNaN(calculatedAge) || (calculatedAge >= 20 && calculatedAge <= 65)) {
      setStatus('');
      setIcon(true)
      updateAppDetails({ name: fieldName, value: dayjs(date).format("MM-DD-YYYY"), });
    } else {
      setStatus('error');
      setIcon(true);
      updateAppDetails({ name: fieldName, value: dayjs(date).format("MM-DD-YYYY") });
    }
  };

  

  const isDateTimeValid = (dateStr) => {
    return dayjs(dateStr).isValid();
  };

  React.useEffect(() => {
    if(rendered ){
        const calculatedAge = calculateAge(getitem);
        setIcon(true);
        if ((calculatedAge >= 20 && calculatedAge <= 65)) {
          setStatus('');
          setIcon(true);
        } else {
          setStatus('error');
          setIcon(true);
        }    
      }
}, []);

  return (
    <div className={className_dmain}>
      {category === 'marketing' || category === 'direct' ? (
        <label className={className_label}>{label}</label>
      ) : null}

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
            getIcon === true ? (
              getStatus === "error" ? (
                <ExclamationCircleFilled
                  style={{ color: "#ff6767", fontSize: "12px" }}
                />
              ) : (
                <CheckCircleFilled
                  style={{ color: "#00cc00", fontSize: "12px" }}
                />
              )
            ) : (
              <></>
            )
          }
          format={'MM-DD-YYYY'}
        />
        {getStatus === 'error' ? (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {'Required (Min. 20 Years Old and Max. 65 Years Old)'}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default DatePicker_BDay;