import * as React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

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
    required,
    calculated_val,
}) {
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const [getItem, setItem] = React.useState(value ? value.toString() : '0.00');

    const debreceive = React.useCallback(
        debounce((newValue) => {
            receive(newValue);
        }, 300),
        [receive]
    );

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
        if (!num) return '0.00';
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

        // If the current display is "0.00" and the user starts typing, clear it
        const plainNum = removeCommas(num);
        const parsedNum = parseFloat(plainNum);
        const formattedValue = plainNum ? formatNumberWithCommas(plainNum) : '';

        setItem(formattedValue); // Display the user's input
        debreceive(formattedValue || '0.00'); // Send '0.00' if input is empty

        setStatus('');
        setIcon(true);
    }

    function onBlur() {
        setIcon(true);
        const plainNum = removeCommas(getItem);
        const parsedNum = parseFloat(plainNum);

        // If the input is empty, set it back to "0.00"
        if (!plainNum) {
            setItem('0.00');
            debreceive('0.00');
        } else {
            setItem(formatNumberWithCommas(formatToTwoDecimalPlaces(parsedNum || 0)));
        }

        setStatus('');
    }

    React.useEffect(() => {
        if (rendered) {
            onBlur();
        }
    }, []);

    React.useEffect(() => { 
        if (rendered && calculated_val !== undefined) {
            setItem(formatNumberWithCommas(formatToTwoDecimalPlaces(calculated_val ? calculated_val.toString() : '0.00')));
            if (calculated_val === 0 || calculated_val && (placeHolder === 'Calculated Monthly Amortization' || placeHolder === 'Calculated Total Exposure')) {
                setStatus('');
            } else {
                setStatus('error');
            }
        }
    }, [calculated_val]);

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
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    size="large"
                    placeholder={placeHolder}
                    onChange={onChange}
                    onBlur={onBlur}
                    readOnly={readOnly}
                    status={(required || required === undefined) ? getStatus : false}
                    style={{ width: '100%' }}
                    maxLength={placeHolder === 'Enter Interest Rate' ? 4 : (placeHolder !== 'Rent Amount' && placeHolder !== 'Monthly Amortization' ? 12 : 9)}
                    suffix={
                        getIcon && (required || required === undefined) ? (
                            <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                                {getStatus === 'error' ? (
                                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                ) : (
                                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                )}
                            </span>
                        ) : null
                    }
                />
                {(getStatus === 'error' && (required || required === undefined)) && (
                    <div className="text-xs text-red-500 pt-1 pl-2">
                        {placeHolder === 'Enter Interest Rate'
                            ? 'Interest rate must be between 1.99% and 2.5%'
                            : placeHolder !== 'Rent Amount' && placeHolder !== 'Monthly Amortization' && placeHolder !== 'Calculated Monthly Amortization' && placeHolder !== 'Calculated Total Exposure' && label !== 'Other Exposure'
                                ? `${placeHolder} Required (Min. amount of 30,000.00)`
                                : `${placeHolder} is Required`
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default LabeledCurrencyInput;
