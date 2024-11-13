import * as React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function LabeledCurrencyInput({
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
    getStep,
    getMaxStep,
    fieldName
}) {
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
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
        }

        const plainNum = removeCommas(num);
        const formattedValue = formatNumberWithCommas(plainNum);

        setItem(formattedValue);
        if (label !== 'Rent Amount' && label !== 'Monthly Amortization') {
            if (!(parseFloat(plainNum) >= 30000)) {
                setStatus('error');
                setIcon(true);
                updateAppDetails({ name: fieldName, value: null })
            } else {
                setStatus('');
                setIcon(true);
                updateAppDetails({ name: fieldName, value: formattedValue })
            }
        }
        else {
            if (!plainNum) {
                setStatus('error');
                setIcon(true);
                receive()
            } else {
                setStatus('');
                setIcon(true);
                updateAppDetails({ name: "loanAmount", value: formattedValue })
            }
        }
    }

    function onBlur() {
        setIcon(true);
        const plainNum = removeCommas(getItem);
        const parsedNum = parseFloat(plainNum);
        if (label !== 'Rent Amount' && label !== 'Monthly Amortization') {
            if (!plainNum || parsedNum < 30000) {
                setStatus('error');
            } else {
                const formattedValue = formatToTwoDecimalPlaces(parsedNum);
                setItem(formatNumberWithCommas(formattedValue)); // Format with commas and 2 decimal places
                setStatus('');
            }
        }
        else {
            if (!plainNum) {
                setStatus('error');
            } else {
                setStatus('');
            }
        }

    }
    React.useEffect(() => {
        if (getMaxStep > getStep) {
            onBlur()
        }
    }, [getMaxStep, getStep]);

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
                    value={getItem}
                    disabled={disabled}
                    size="large"
                    placeholder={placeHolder}
                    onChange={(e) => onChange(e)}
                    onBlur={(e) => onBlur(e)}
                    readOnly={readOnly}
                    status={getStatus}
                    style={{ width: '100%' }}
                    maxLength={label !== 'Rent Amount' && label !== 'Monthly Amortization' ? 12 : 6}
                    suffix={
                        getIcon === true
                            ? getStatus === 'error'
                                ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                            : (<></>)
                    }
                />
                {getStatus === 'error' && (
                    (<div className='text-xs text-red-500 pt-1 pl-2'>
                        {
                            label !== 'Rent Amount' && label !== 'Monthly Amortization'
                                ? placeHolder + " Required (Minimum amount of 30,000.00)"
                                : placeHolder + " is Required"
                        }
                    </div>)
                )}
            </div>
        </div>
    );
}

export default LabeledCurrencyInput;
