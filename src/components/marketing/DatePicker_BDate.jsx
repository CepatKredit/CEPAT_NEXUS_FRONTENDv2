import { Input, DatePicker } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled, CalendarOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DateComponentHook } from '@hooks/ComponentHooks';

function DatePicker_BDay({
  rendered,
  required,
  placeHolder,
  label,
  value,
  receive,
  disabled,
  readOnly,
  className_dmain,
  className_label,
  className_dsub,
  KeyName,
  notValid,
  disabledate,
}) {  

  const {
    status,
    iconVisible,
    inputValue,
    isDatePickerOpen,
    handleInputChange,
    handleDateChange,
    datePickerValue,
    toggleDatePicker,
    setDatePickerOpen,
  } = DateComponentHook(value, receive, rendered, KeyName);




  const icon = status === 'error' ? (
    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
  ) : (
    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
  );

  const suffix = (
    <>
      <CalendarOutlined
        style={{ color: '#1890ff', fontSize: '16px', marginLeft: 8, cursor: 'pointer' }}
        onClick={toggleDatePicker}
      />
      {iconVisible && icon}
    </>
  );

  return (
    <div className={className_dmain}>
      <label className={className_label}>{label}</label>
      <div className={className_dsub} style={{ position: 'relative' }}>
        {!isDatePickerOpen ? (
          <Input
            size="large"
            placeholder={placeHolder}
            value={inputValue}
            onChange={(e) => handleInputChange(e, readOnly)}
            disabled={disabled}
            readOnly={readOnly}
            status={status}
            maxLength={10}
            suffix={suffix}
          />
        ) : (
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            open={isDatePickerOpen}
            format="MM-DD-YYYY"
            value={datePickerValue}
            onChange={handleDateChange}
            onOpenChange={setDatePickerOpen}
            disabled={disabled}
            inputReadOnly
            disabledDate={disabledate}
            status={status}
            suffix={iconVisible && icon}
          />
        )}
        { ((required || required === undefined) && status === 'error') && (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {label !== 'Contract Date'
              ? 'Required (Min. 20 Years Old and Max. 65 Years Old)'
              : `${notValid}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePicker_BDay;
