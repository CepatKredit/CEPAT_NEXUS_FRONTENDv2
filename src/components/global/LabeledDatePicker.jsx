import * as React from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function LabeledDatePicker({ className, label, value, receive, disabled,readOnly }) {

    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }

    function onDateChange(date, dateString) {
        receive(dayjs(dateString, 'MM-DD-YYYY'))
    }

    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <DatePicker
                    size='large'
                    format={'MM-DD-YYYY'}
                    style={{ width: '100%' }}
                    disabled={disabled}
                    readOnly={readOnly}
                    onChange={onDateChange}
                    value={isDateTimeValid(value) === false
                        ? undefined : value}
                />
            </div>
        </div>
    )
}

export default LabeledDatePicker