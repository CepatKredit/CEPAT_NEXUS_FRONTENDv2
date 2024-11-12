import { Input, DatePicker } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled, CalendarOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef } from 'react';
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
  notValidMsg,
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
    validationMessage,
    handleBlur,
  } = DateComponentHook(value, receive, rendered, KeyName);

  const inputRef = useRef(null);
  const { setfocus } = useContext(LoanApplicationContext)
  useEffect(() => {
      setfocus(KeyName, inputRef.current);
  }, [KeyName, setfocus])


  const icon =
    status === "error" ? (
      <ExclamationCircleFilled style={{ color: "#ff6767", fontSize: "12px" }} />
    ) : status === "" ? (
      <CheckCircleFilled style={{ color: "#00cc00", fontSize: "12px" }} />
    ) : null;

  const suffix = (
    <>
      <CalendarOutlined
        style={{
          color: "#1890ff",
          fontSize: "16px",
          marginLeft: 8,
          cursor: "pointer",
        }}
        onClick={toggleDatePicker}
      />
      {iconVisible && icon}
    </>
  );

  return (
    <div className={className_dmain}>
      <label className={className_label}>{label}</label>
      <div className={className_dsub} style={{ position: "relative" }}>
        {!isDatePickerOpen ? (
          <Input
            size="large"
            placeholder={placeHolder}
            value={inputValue}
            onChange={(e) => handleInputChange(e, readOnly)}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            status={status}
            maxLength={10}
            suffix={suffix}
            ref={inputRef}
          />
        ) : (
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            open={isDatePickerOpen}
            format="MM-DD-YYYY"
            value={datePickerValue}
            onChange={handleDateChange}
            onOpenChange={setDatePickerOpen}
            onBlur={handleBlur}
            disabled={disabled}
            inputReadOnly
            disabledDate={disabledate}
            status={status}
            suffix={iconVisible && icon}
          />
        )}
        {((required || required === undefined) && status === 'error') && (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {validationMessage || notValidMsg}
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePickerOpt;
