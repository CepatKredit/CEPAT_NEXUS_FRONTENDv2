import { Input, DatePicker } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled, CalendarOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DateComponentHook } from '@hooks/ComponentHooks';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function DatePickerOpt({
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
  disabledate,

  compname,
  InvalidMsg = 'Date is not Valid',
  EmptyMsg = `${compname} Required`,
}) {
  const [isRendered, setRendered] = useState(rendered !== undefined ? rendered : true);//make sure rendered has a value

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
    validationMessage,
    handleBlur,
  } = DateComponentHook(value, rendered, receive, KeyName, setRendered, InvalidMsg, EmptyMsg);

  const inputRef = useRef(null);
  const { setfocus } = useContext(LoanApplicationContext)
  
  useEffect(() => {
    setfocus(KeyName, inputRef.current);
  }, [KeyName, setfocus])

  const icon =
    (required || required === undefined) && status === "error" ? (
      <ExclamationCircleFilled style={{ color: "#ff6767", fontSize: "12px" }} />
    ) : (required || required === undefined) && status === "" ? (
      <CheckCircleFilled style={{ color: "#00cc00", fontSize: "12px" }} />
    ) : null;

  const suffix = (
    <>{!disabled ? (<CalendarOutlined
      style={{
        color: "#1890ff",
        fontSize: "16px",
        marginLeft: 8,
        cursor: "pointer",
      }}
      onClick={toggleDatePicker}
    />) : null}

      {isRendered && (required || required === undefined) && iconVisible && icon}
    </>
  );

  return (
    <div className={className_dmain}>
      <label className={className_label}>{label}</label>
      <div className={className_dsub} style={{ position: "relative" }}>
        {!isDatePickerOpen ? (
          <Input
            autoCapitalize='off'
            aria-autocomplete='off'
            autoSave='off'
            autoComplete="off"
            size="large"
            placeholder={placeHolder}
            value={inputValue}
            onChange={(e) => handleInputChange(e, readOnly)}
            onBlur={(e) => { handleBlur(e.target.value) }}
            disabled={disabled}
            readOnly={readOnly}
            status={isRendered && (required || required === undefined) && status}
            maxLength={10}
            suffix={suffix}
            ref={inputRef}
          />
        ) : (
          <DatePicker
            autoCapitalize='off'
            aria-autocomplete='off'
            autoSave='off'
            autoComplete='off'
            size="large"
            style={{ width: "100%" }}
            open={isDatePickerOpen}
            format="MM-DD-YYYY"
            value={datePickerValue}
            onChange={handleDateChange}
            onOpenChange={setDatePickerOpen}
            onBlur={(e) => { handleBlur(e.target.value) }}
            disabled={disabled}
            inputReadOnly
            disabledDate={disabledate}
            status={isRendered && (required || required === undefined) && status}
            suffix={iconVisible && icon}
          />
        )}
        {isRendered && ((required || required === undefined) && status === 'error') && (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {validationMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePickerOpt;
