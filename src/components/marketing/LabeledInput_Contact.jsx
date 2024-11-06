import React, { useEffect, useCallback, useState } from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce'; // Custom debounce function

function LabeledInput_Contact({ rendered, required, label, placeHolder, value, receive, disabled, readOnly, triggerValidation, type, category, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = useState('');
    const [getIcon, setIcon] = useState(false);
    const [getItem, setItem] = useState(value || '09');

    // Debounce the value change to avoid updating state on every keystroke
    const debouncedReceive = useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);

    useEffect(() => {
        if (triggerValidation) {
            if (!getItem || getItem.length !== 11 || !getItem.startsWith('09')) {
                setStatus('error');
            } else {
                setStatus('');
            }
            setIcon(true);
        }
    }, [triggerValidation, getItem]);

    const onChangeValue = useCallback((e) => {
        let newValue = e.target.value;

        if (/^[0-9]*$/.test(newValue)) {
            if (newValue.length <= 10) {
                if (!newValue.startsWith('09')) {
                    newValue = '09' + newValue.slice(2);
                }
                setItem(newValue);
                setStatus('error');
                setIcon(true);
                debouncedReceive()
            } else if (newValue.length === 11) {
                setItem(newValue);
                setStatus('');
                setIcon(true);
                debouncedReceive(newValue); // Use debounced function for updating value
            }
        }
    }, [debouncedReceive]);

    const onBlur = useCallback(() => {
        setIcon(true);
        if (getItem.length !== 11 || !getItem.startsWith('09')) {
            setStatus('error');
        } else {
            setStatus('');
        }
    }, [getItem]);

    useEffect(() => {
        if (rendered) {
            onBlur();
        }
    }, [rendered, onBlur]);
   
        React.useEffect(() => {
        setItem(value?value.toString(): '')
        if (rendered) {
            onBlur();
        }
        }, [value]);

    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>

            <div className={className_dsub}>
                <Input
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    disabled={disabled}
                    readOnly={readOnly}
                    value={getItem}
                    onChange={onChangeValue}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    onBlur={onBlur}
                    status={!readOnly && (required || required === undefined) ? getStatus : false}
                    suffix={
                        !readOnly && (required || required === undefined) ? (
                            <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                                {getStatus === 'error'
                                    ? <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                    : <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                }
                            </span>
                        ) : (<></>)
                    }
                />
                {!readOnly && (required || required === undefined) ? (
                    getStatus === 'error' ? (
                        <div className='text-xs text-red-500 pt-1 pl-2'>
                            {placeHolder + " Required"}
                        </div>
                    ) : null
                ) : null}
            </div>
        </div>
    );
}

export default LabeledInput_Contact;