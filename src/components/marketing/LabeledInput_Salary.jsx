import * as React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput_Salary({ rendered, triggered,
    placeHolder, label, value, receive, disabled, readOnly, category, className_dmain, className_label, className_dsub, required }) {
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const [getItem, setItem] = React.useState(value ? value.toString() : '');

    // Debounce the value change to avoid updating state on every keystroke
    const debreceive = React.useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);

    function formatNumberWithCommas(num) {
        //if (!num) return '';
        const parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function removeCommas(num) {
        //if (!num) return '';
        return num.replace(/,/g, '');
    }

    function formatToTwoDecimalPlaces(num) {
        //if (!num) return '';
        return parseFloat(num).toFixed(2);
    }

    function onChange(e){
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
            debreceive();
        } else {
            setStatus('');
            setIcon(true);
            debreceive(formattedValue)
        }
    }

    function onBlur() {
        setIcon(true);
        const plainNum = removeCommas((value|| 0).toString());
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
        if (rendered) {
            onBlur()
        }
    }, [rendered]);

    const preload = React.useRef(1)
    React.useEffect(() => { // For clearing value when triggered change
        if (preload.current > 1) {
            setItem('');
            setStatus('error');
            setIcon(true);
        } else {
            preload.current++;
        }
    }, [triggered]);

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
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    disabled={disabled}
                    readOnly={readOnly}
                    value={getItem || undefined}
                    onChange={(e) => { onChange(e) }}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    onBlur={(e) => { onBlur(e) }}
                    status={!readOnly && (required || required === undefined) ? getStatus : false}
                    suffix={
                        !readOnly && (required || required === undefined) && getIcon ? (
                            getStatus === 'error' ? (
                                <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                            ) : (
                                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            )
                        ) : null
                    }
                />
                {!readOnly && (required || required === undefined) && getStatus === 'error' && (
                    <div className="text-xs text-red-500 pt-1 pl-2">
                        {`${placeHolder} Required (Minimum of 25,000.00)`}
                    </div>
                )}
            </div>
        </div>
    );

}

export default LabeledInput_Salary;