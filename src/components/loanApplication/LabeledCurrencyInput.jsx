import * as React from 'react';
import { Input, Form } from 'antd';
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
    rendered,
    fieldName
}) {
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext)

    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const [getItem, setItem] = React.useState(getAppDetails[fieldName] || '');

    const minAmount = fieldName === "ofwsalary" ? 25000 : fieldName === "loanAmount" ? 30000 : 0;

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

        if (minAmount !== null && parseFloat(plainNum) < minAmount || !plainNum) {
            setStatus('error');
            setIcon(true);
            updateAppDetails({ name: fieldName, value: null });
        } else {
            setStatus('success');
            setIcon(true);
            updateAppDetails({ name: fieldName, value: formattedValue });

        }
    } 

    function onBlur() {
        setIcon(true);
        const plainNum = removeCommas(getItem);
        const parsedNum = parseFloat(plainNum);
        const formattedValue = formatToTwoDecimalPlaces(parsedNum);

        setItem(formatNumberWithCommas(formattedValue));

        if (minAmount !== null && (!plainNum || parsedNum < minAmount)) {
            setStatus('error');
            setIcon(true);
        } else {
            setStatus('success');
            setIcon(true);
        }
    }

    React.useEffect(() => {
        if (rendered) {
            onBlur()
        }}
    , []);

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
                    maxLength={label !== 'Rent Amount' && label !== 'Monthly Amortization'? 12 : 9}
                    suffix={
                        getIcon === true
                            ? getStatus === 'error'
                                ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                            : (<></>)
                    }
                />
                {getStatus === 'error' && (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {minAmount !== null 
                            ? `${placeHolder} Required (Minimum amount of ${minAmount.toLocaleString()})`
                            : `${placeHolder} is Required`

                        }
                    </div>
                )}
            </div> 
        </div>  
    );
}

export default LabeledCurrencyInput;
