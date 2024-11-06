import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Input } from 'antd';
import { toUpperText } from '@utils/Converter';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput({ disabled, rendered, required, label, placeHolder, value, receive, readOnly, triggerValidation, className_dmain, className_label, className_dsub }) {
    const [getInput, setInput] = useState(value || '');
    const [getStatus, setStatus] = useState('');
    const [getIcon, setIcon] = useState(false);

    const inputRef = useRef(null); // Reference to the input element
    const cursorPositionRef = useRef(null); // Reference to store the cursor position

    const debouncedReceive = React.useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);

    function onChange(e) {
        const newValue = e.target.value;
        cursorPositionRef.current = e.target.selectionStart; // Store the cursor position

        setIcon(false);
        const upperValue = toUpperText(newValue);
        setInput(upperValue);

        if (newValue) {
            setStatus('');
            setIcon(true);
            debouncedReceive(upperValue);
        } else {
            setStatus('error');
            setIcon(true);
            debouncedReceive(undefined);
        }
    }

    function onBlur() {
        setIcon(true);
        if (!getInput) {
            setStatus('error');
        } else {
            setStatus('');
        }
    }

    useLayoutEffect(() => {
        if (inputRef.current && cursorPositionRef.current !== null) {
            inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
        }
    }, [getInput]); // Apply the cursor position after getInput updates

    useEffect(() => {
        if (rendered || triggerValidation) {
            setInput(value)
            setIcon(false);
            if (value) {
                setStatus('');
                setIcon(true);
            } else {
                setStatus('error');
                setIcon(true);
            }
        }
    }, [value, rendered, triggerValidation]);

    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>
            <div className={className_dsub}>
                <Input
                    ref={inputRef} // Attach ref to input
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    size='large'
                    value={getInput}
                    placeholder={placeHolder}
                    onChange={onChange}
                    disabled={disabled}
                    onBlur={onBlur}
                    readOnly={readOnly}
                    status={!readOnly && getStatus === 'error' ? 'error' : ''}
                    suffix={
                        !readOnly && (required || required === undefined) ? (
                            getIcon === true
                                ? getStatus === 'error'
                                    ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                    : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                                : (<></>)
                        ) : (<></>)
                    }
                />
                {
                    !readOnly && (required || required === undefined) && getStatus === 'error' ? (
                        <div className='text-xs text-red-500 pt-1 pl-2'>
                            {placeHolder + " Required"}
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}

export default LabeledInput;
