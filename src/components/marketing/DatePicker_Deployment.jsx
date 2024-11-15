import * as React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function DatePicker_Deployment({rendered, disabledate, placeHolder, label, value, receive, disabled, readOnly, category, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value ? dayjs(value) : '';

    
    function selectedDate(date) {
        // Immediately update the item state first
        getItem = date
        if (!dayjs().isBefore(date,'day') && !dayjs().isSame(dayjs(date),'day')) {
            // If the selected date is in the past or today, set error state
            setStatus('error');
            setIcon(true);
            receive(); // Call receive with undefined for invalid date
        } else {
            // Valid date selection
            setStatus('');
            setIcon(true);
            receive(date); // Pass the valid date back to the parent
        }
    }
    const isDateTimeValid = (dateStr) => {
        return dayjs(dateStr).isValid();
      };

    React.useEffect(() => {
        if(rendered){
            if (!isDateTimeValid(value)) {
                setStatus('error');
                setIcon(true);
            } else {
                setStatus('');
                setIcon(true);
            }
        }
    }, []);



    return (


        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>

            <div className={className_dsub}>

                <DatePicker
                    allowClear
                    format={'MM-DD-YYYY'}
                    value={isDateTimeValid(getItem) ? getItem : undefined}
                    disabled={disabled}
                    size='large'
                    placeholder={placeHolder}
                    onChange={(_,e) => { 'Birth'.includes(label) ? onBdateChange(e) : selectedDate(e) }}
                    //onBlur={(e) => { 'Birth'.includes(label) ? onBlur_bdate(e) : onBlur_deploy(e) }}
                    disabledDate={disabledate}
                    readOnly={readOnly}
                    status={getStatus}
                    style={{ width: '100%' }}
                    suffixIcon={
                        getIcon === true
                            ? getStatus === 'error'
                                ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                            : (<></>)
                    }
                />
                {
                    getStatus === 'error'
                        ? (<div className='text-xs text-red-500 pt-1 pl-2'>
                            {!'Birth'.includes(placeHolder) ? placeHolder + " Required (MM-DD-YYYY)" : placeHolder + " Required (Must be atleast 20 Years Old)"}

                        </div>)
                        : (<></>)
                }

            </div>
        </div>
    )
}

export default DatePicker_Deployment;
