import { Input, DatePicker } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Age } from '@utils/Calculations';
import { DateFormat } from '@utils/Formatting';
import { CheckDateValid } from '@utils/Validations';

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
}) {
  const [getStatus, setStatus] = useState('');
  const [getIcon, setIcon] = useState(false);
  const [inputValue, setInputValue] = useState(value ? dayjs(value).format('MM-DD-YYYY') : '');
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState(inputValue);

  const handleInputChange = (e) => {
    if (readOnly) return;
    const formattedValue = DateFormat(e.target.value);
    setInputValue(formattedValue);
    setDebouncedInput(formattedValue);
  };

  const handleDateChange = (dateValue) => {
    if (CheckDateValid(dateValue)) {
      const formattedValue = dateValue.format('MM-DD-YYYY');
      setInputValue(formattedValue);
      setDebouncedInput(formattedValue);
      setDatePickerOpen(false);
    }
  };

  const toggleDatePicker = () => {
    setDatePickerOpen((prev) => !prev);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedInput.length === 10) {
        const date = dayjs(debouncedInput, 'MM-DD-YYYY');
        if (date.isValid()) {
          const calculatedAge = Age(date.toDate());
          setIcon(true);
          if (calculatedAge >= 20 && calculatedAge <= 65) {
            setStatus('');
            receive(date);
          } else {
            setStatus('error');
            receive();
          }
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
        receive();
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [debouncedInput]);

  useEffect(() => {
    if (rendered) {
      const calculatedAge = Age(value ? value : '');
      setIcon(true);
      if (calculatedAge >= 20 && calculatedAge <= 65) {
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

      <div className={className_dsub} style={{ position: 'relative' }}>
        {!isDatePickerOpen && (
          <Input
            size="large"
            placeholder={placeHolder}
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            readOnly={readOnly}
            status={getStatus}
            maxLength={10}
            suffix={
              <>
              <CalendarOutlined
                  style={{ color: '#1890ff', fontSize: '16px', marginLeft: 8, cursor: 'pointer' }}
                  onClick={toggleDatePicker}
                />
                {getIcon ? (
                  getStatus === 'error' ? (
                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                  ) : (
                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                  )
                ) : null}
              </>
            }
          />
        )}

        {isDatePickerOpen && (
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            open={isDatePickerOpen}
            format="MM-DD-YYYY"
            value={inputValue ? dayjs(inputValue, 'MM-DD-YYYY') : null}
            onChange={handleDateChange}
            onOpenChange={(open) => setDatePickerOpen(open)}
            disabled={disabled }
            inputReadOnly 
            status={getStatus}
            suffix={getIcon ? (
              getStatus === 'error' ? (
                <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
              ) : (
                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
              )
            ) : null}
          />
        )}

        {getStatus === 'error' && (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {label !== 'Contract Date'
              ? 'Required (Min. 20 Years Old and Max. 65 Years Old)'
              : `${label} Required`}
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePicker_BDay;
