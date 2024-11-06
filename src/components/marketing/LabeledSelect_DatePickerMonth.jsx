import { DatePicker, Tooltip } from 'antd';  // Import Tooltip
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

function LabeledSelect_DatePickerMonth({
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
}) {
  const { MonthPicker } = DatePicker;

  const [getStatus, setStatus] = useState('');
  const [getIcon, setIcon] = useState(false);

  // Use dayjs for value parsing instead of moment
  let getItem = value ? dayjs(value, 'MM-YYYY') : null;

  function onChange(date, dateString) {
    if (dateString) {
      receive(dateString); // Send formatted date
      setIcon(true);
      setStatus('');
    } else {
      setIcon(true);
      setStatus('error');
    }
  }

  const isDateTimeValid = (dateStr) => {
    return dayjs(dateStr, 'MM-YYYY', true).isValid();
  };

  useEffect(() => {
    if (rendered) {
      if (!isDateTimeValid(value)) {
        setStatus('error');
        setIcon(true);
      } else {
        setStatus('');
        setIcon(true);
      }
    }
  }, [rendered, value]);

  return (
    <>
      <MonthPicker
        className="w-full h-[40px] border border-gray-300 rounded-md px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeHolder}
        onChange={onChange}
        value={getItem}
        disabled={disabled}
        format="MM-YYYY"
        status={getStatus}
        style={{ width: '100%' }}
        suffixIcon={
          getIcon === true
            ? getStatus === 'error'
              ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
              : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
            : null
        }
      />
      {getStatus === 'error' && (
        <div className='text-xs text-red-500 pt-1 pl-2'>
          {placeHolder + ' Required (MM-YYYY)'}
        </div>
      )}
    </>
  );
}

export default LabeledSelect_DatePickerMonth;
