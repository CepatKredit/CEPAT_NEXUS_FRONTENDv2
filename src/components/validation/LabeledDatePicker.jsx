import * as React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function LabeledDatePicker({ className, label, value, receive, disabled, readOnly, placeholder }) {
   

    // Function to validate date
    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }

    // Function to handle date change
    function onDateChange(date, dateString) {
        receive(dayjs(dateString, 'MM-DD-YYYY'));
    }


    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <DatePicker
                    style={{
                        width: '100%',
                        backgroundColor: disabled ? 'rgba(4, 169, 77, 0.1)' : 'inherit',
                    }}
                    size='large'
                    format={'MM-DD-YYYY'}
                    disabled={disabled}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onChange={onDateChange}
                    value={isDateTimeValid(value) ? dayjs(value) : undefined}
                />
            </div>
        </div>
    );
}

export default LabeledDatePicker;
