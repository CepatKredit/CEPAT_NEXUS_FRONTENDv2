import { Input } from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { InputComponentHook } from '@hooks/ComponentHooks';
import { useContext, useEffect, useRef, useState } from 'react';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function InputOpt({
    rendered,
    required = true,
    label,
    placeHolder,
    value,
    receive,
    readOnly = false,
    disabled = false,
    className_dmain = '',
    className_label = '',
    className_dsub = '',
    className_component,
    onClick,

    KeyName,
    format = '',
    group,
    CustomLength = 13,
    compname,
    InvalidMsg = 'Input is not Valid',
    EmptyMsg = `${compname} Required`,
}) {

    const [isFocused, setIsFocused] = useState();
    const { inputValue, status, iconVisible, handleChange, handleBlur, errorMessage, inputRef } = InputComponentHook(value, receive, rendered, KeyName, compname, format, group, disabled, isFocused, InvalidMsg, EmptyMsg, readOnly);
    const isValidationEnabled = !readOnly && required;

    return (
        <div className={className_dmain}>
            {label && <label className={className_label}>{label}</label>}
            <div className={className_dsub}
                onBlur={() => { setIsFocused(true); }}
                onFocus={() => { setIsFocused(false); }}
            >
                <Input
                    ref={inputRef}
                    disabled={disabled}
                    className={group !== 'FBLink' ? `w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}` : className_component}
                    readOnly={readOnly}
                    value={inputValue}
                    onChange={ handleChange }
                    size="large"
                    placeholder={placeHolder}
                    autoComplete="off"
                    onClick={onClick}
                    style={{ width: '100%' }}
                    maxLength={250} //Initial
                    onBlur={handleBlur}
                    status={isValidationEnabled ? status : undefined}
                    suffix={
                        isValidationEnabled && (
                            <span style={{ visibility: iconVisible ? 'visible' : 'hidden' }}>
                                {status === 'error' ? (
                                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                ) : (
                                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                )}
                            </span>
                        )
                    }
                />
                {isValidationEnabled && status === 'error' && (
                    <div className="text-xs text-red-500 pt-1 pl-2">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InputOpt;
