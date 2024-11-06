import * as React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function  LabeledInput_NotRequired({
    required,
    label,
    placeHolder,
    value,
    receive,
    readOnly,
    disabled,
    type = 'text',  // Default to 'text' input
    className_dmain,
    className_label,
    className_dsub
}) {
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(type === 'contact' ? (value || '09') : (value || ''));

    const debReceive = React.useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);
    
    React.useEffect(()=>{
        setInputValue(value)
    },[value])

    function onChange(e) {
        let newValue = e.target.value;

        // Handle contact type separately
        if (type === 'contact') {
            if (/^[0-9]*$/.test(newValue)) {
                if (newValue.length <= 10) {
                    if (!newValue.startsWith('09')) {
                        newValue = '09' + newValue.slice(2);
                    }
                    setInputValue(newValue);
                    debReceive();
                    setStatus('error');
                    setIcon(true);
                } else if (newValue.length === 11) {
                    setInputValue(newValue);
                    debReceive(newValue);
                    setStatus('');
                    setIcon(true);
                }
            }
        } else {
            // Handle regular text and non-required text inputs
            const upperValue = newValue.toUpperCase();  // Convert to uppercase for all other inputs
            setInputValue(upperValue);
            debReceive(upperValue);

            if (required && !upperValue) {
                setStatus('error');
                setIcon(true);
            } else {
                setStatus('');
                setIcon(true);
            }
        }
    }

    function onBlur() {
        setIcon(true);
        if (type === 'contact') {
            if (inputValue.length !== 11 || isNaN(inputValue)) {
                setStatus('error');
            } else {
                setStatus('');
            }
        } else if (required && !inputValue) {
            setStatus('error');
        } else {
            setStatus('');
        }
    }

    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>
            <div className={className_dsub}>
                <Input
                    disabled={disabled}
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    readOnly={readOnly}
                    value={inputValue}
                    onChange={onChange}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    onBlur={onBlur}
                    status={!readOnly && required ? getStatus : false}
                    suffix={
                        !readOnly && required ? (
                            <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                                {getStatus === 'error'
                                    ? <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                    : <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                }
                            </span>
                        ) : (<></>)
                    }
                />
                {required && getStatus === 'error' && (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder !== 'FB Profile' ? `${placeHolder} Required` : `${placeHolder} Required (e.g. http://www.facebook.com/jdelacruz)`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LabeledInput_NotRequired;