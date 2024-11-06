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
    className_dsub }) {
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const [getItem, setItem] = React.useState(parseFloat(value) || 0);

    function formatNumberWithCommas(num) {
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function removeCommas(num) {
        if (typeof num !== 'string') return num;
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
    React.useEffect(() => {
        onBlur(); // Run onBlur once during initialization
    }, []); // Empty dependency array means this runs once when the component mounts
    

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
