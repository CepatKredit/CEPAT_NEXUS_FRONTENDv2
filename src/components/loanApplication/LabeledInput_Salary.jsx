import * as React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledInput_Salary({
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
    rendered }) {
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const [getItem, setItem] = React.useState(value || '');

    function formatNumberWithCommas(num) {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function removeCommas(num) {
        return num.replace(/,/g, '');
    }

    function formatToTwoDecimalPlaces(num) {
        if (!num) return '';
        return parseFloat(num).toFixed(2);
    }

    function onChange(e) {
        let num = e.target.value.replace(/[^0-9.]/g, '');
        const periodCount = num.split('.').length - 1;
        if (periodCount > 1) {
            num = num.slice(0, -1);
        } else if (periodCount === 1) {
            const parts = num.split('.');
            if (parts[1] && parts[1].length > 2) {
                parts[1] = parts[1].slice(0, 2); 
            }
            num = parts.join('.');
        }
        const plainNum = removeCommas(num);
        const formattedValue = formatNumberWithCommas(plainNum);

        setItem(formattedValue);
        if (!(parseFloat(plainNum) >= 25000)) {
            setStatus('error');
            setIcon(true);
            receive()
        } else {
            setStatus('');
            setIcon(true);
            receive(formattedValue)
        }
    }

    React.useEffect(() => {
        if(rendered ){
            setIcon(false)
            if (!(parseFloat(getItem.replaceAll(',','')) >= 25000)) {
                setStatus('error');
                setIcon(true);
            } else {
                setStatus('');
                setIcon(true);
            }
        }
        
    }, []); 

    function onBlur() {
        setIcon(true);
        const plainNum = removeCommas(getItem);
        const parsedNum = parseFloat(plainNum);

        if (!plainNum || parsedNum < 25000) {
            setStatus('error');
        } else {
            const formattedValue = formatToTwoDecimalPlaces(parsedNum);
            setItem(formatNumberWithCommas(formattedValue));
            setStatus('');
        }
    }


    return (
        <div className={className_dmain}>
            {category === 'marketing' ? (
                <div>
                    <label className={className_label}>{label}</label>
                </div>
            ) : category === 'direct' ? (
                <label className={className_label}>{label}</label>
            ) : null}

            <div className={className_dsub}>
                <Input
                    disabled={disabled}
                    readOnly={readOnly}
                    value={getItem}
                    onChange={(e) => { onChange(e) }}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    onBlur={(e) => { onBlur(e) }}
                    maxLength={12}
                    status={getStatus}
                    suffix={
                        <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                            {getStatus === 'error'
                                ? <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                : <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            }
                        </span>
                    }
                />
                {getStatus === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder + " Required (Minimum of 25,000.00)"}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default LabeledInput_Salary;
