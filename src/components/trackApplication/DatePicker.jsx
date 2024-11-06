
import * as React from 'react';
import { useState } from 'react';
import { DatePicker, Tooltip, Form } from 'antd';
import moment from 'moment';

function DateSelector({ label, placeholder, value, receive, disabled, readOnly, category, className_dmain, className_label, className_dsub }) {
    const [showHelpText, setShowHelpText] = useState(false);
    const [dateValue, setDateValue] = useState(value); // State variable for DatePicker value
    const [validateStatus, setValidateStatus] = useState(''); // State for validation status
    const [tooltipVisible, setTooltipVisible] = useState(false); // Tooltip visibility

    function onDateChange(date, dateString) {
        if (date) {
                setDateValue(date);
                setShowHelpText(false);
                setTooltipVisible(false); // Hide tooltip when age is valid
                setValidateStatus('success');
                receive(date);
            
        } else {
            setDateValue(null);
            setAge(null);
            setShowHelpText(false);
            setTooltipVisible(false); // Hide tooltip when no date is selected
            setValidateStatus('');
        }
    }

    function onBlur() {
        if (!dateValue) {
            setShowHelpText(true);
            setTooltipVisible(true); // Show tooltip when no date is selected
            setValidateStatus('error');
            receive();

        } else {
            setTooltipVisible(false); // Hide tooltip when there is a valid date
        }
    }

   

    const datePickerStyle = {
        width: '100%',
        backgroundColor: disabled ? '#f5f5f5' : 'inherit',
        borderRadius: '8px',
    };
    const tooltipContent = 'You must be at least 20 years old.';

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
                <Form.Item
                    validateStatus={validateStatus}
                    hasFeedback // Show feedback (checkmark) icon when valid
                >
                    <Tooltip
                        title={tooltipContent}
                        visible={tooltipVisible && validateStatus === 'error'}
                        placement="bottom"
                    >
                        <DatePicker
                            style={datePickerStyle}
                            size='large'
                            format={'MM-DD-YYYY'}
                            disabled={disabled}
                            readOnly={readOnly}
                            placeholder={placeholder || 'MM-DD-YYYY'}
                            onChange={onDateChange}
                            value={dateValue}
                            onBlur={onBlur}
                        />


                    </Tooltip>
                </Form.Item>
            </div>
        </div>
    )

}

export default DateSelector;
