import { Input } from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { InputComponentHook } from '@hooks/ComponentHooks';
import { useState } from 'react';

function PrefixSelect_Input({
    rendered,
    required = true,
    label,
    Input_placeHolder,
    Select_placeHolder,
    value,
    receive,
    readOnly = false,
    disabled = false,
    className_dmain = '',
    className_label = '',
    className_dsub = '',

    KeyName,
    format = '',
    group,
    CustomLength = 24,//Default for Intl. Contact #
    compname,
    InvalidMsg = 'Input is not Valid',
    EmptyMsg = `${compname} Required`,

    options,

}) {
    const [isFocused, setIsFocused] = useState();

    const { inputValue, status, iconVisible, handleChange, handleBlur, errorMessage } = InputComponentHook(value, receive, rendered, KeyName, compname, format, group, disabled, isFocused, InvalidMsg, EmptyMsg, CustomLength);

    const isValidationEnabled = !readOnly && required;

    const prefix_Select = (
        <Select
            options={CallCodes()?.map(x => ({
                value: x.value,
                label: x.label
            }))}
            value={getPref || undefined}
            onChange={value => onPrefChange(value)}
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.label && option.label.toLowerCase().includes(input.toLowerCase())
            }
            showSearch
            style={{ width: '140px' }}
            dropdownStyle={{ width: '250px' }} // Adjusts the dropdown width
            placeholder={'Country Code'}
        />
    );

    return (
        <div className={className_dmain}>
            {label && <label className={className_label}>{label}</label>}

            <div className={className_dsub}
                onBlur={() => { setIsFocused(true); }}
                onFocus={() => { setIsFocused(false); }}
            >
                <Input
                    prefix = {format==='IntlContact' ? prefix_Select : undefined}
                    disabled={disabled}
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    readOnly={readOnly}
                    value={inputValue}
                    onChange={(e) => { handleChange(e.target.value, true) }}
                    size="large"
                    placeholder={placeHolder}
                    autoComplete="off"
                    style={{ width: '100%' }}
                    maxLength={100} //Initial
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

export default PrefixSelect_Input;
