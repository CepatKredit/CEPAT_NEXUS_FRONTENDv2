import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Select, ConfigProvider } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';
import { SelectComponentHooks } from '@hooks/ComponentHooks';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function SelectOpt({
    label,
    value,
    receive,
    disabled,
    className_dmain,
    className_label,
    className_dsub,
    placeHolder,
    readOnly,
    required,
    showSearch,
    options,
    notValid,
    notValidMsg,
    KeyName,
    rendered,
}) {
    const [search, setSearchInput] = useState('');
    const [isRendered, setRendered] = useState(rendered !== undefined ? rendered : true);//make sure rendered has a value
    const inputRef = useRef(null);
    const { setfocus } = useContext(LoanApplicationContext);

    useEffect(() => {
        setfocus(KeyName, inputRef.current);
    }, [KeyName, setfocus]);

    const {
        status,
        filteredOptions,
        handleSelectChange,
        handleKeyDown,
        setDropdownOpen,
        selected
    } = SelectComponentHooks(search, receive, options, setSearchInput, KeyName, rendered, value, setRendered);

    const newOptions = useMemo(() => {
        if (KeyName === 'ofwcountry') {
            return filteredOptions.map((x) => {
                const bgColor = x.negative === 1 ? 'bg-[#ff0000]' : '';
                const textColor = x.negative === 0 ? 'text-black' : 'text-white';
                return {
                    ...x,
                    label: (
                        <div
                            className={`${bgColor} ${textColor} py-1 px-2 rounded-md h-7 text-sm`}
                        >
                            {x.label}
                        </div>
                    ),
                };
            });
        } else {
            return filteredOptions.map((x) => ({
                ...x,
                label: x.label,
            }));
        }
    }, [KeyName, filteredOptions]);

    const [dropdownOpen, setDropdownVisible] = useState(false);

    const debouncedSearch = useCallback(
        debounce((value) => setSearchInput(value), 300),
        []
    );

    const handleSearch = (value) => {
        debouncedSearch(value);
    };

    const handleDropdownVisibleChange = (open) => {
        setDropdownVisible(open);
    };

    const handleBlur = () => {
        if (required && !value) {
            handleSelectChange('');
        }
    };

    return (
        <div className={className_dmain}>
            <label className={className_label}>{label}</label>
            <div className={className_dsub}>
                <ConfigProvider
                    theme={{
                        components: {
                            Select: {
                                colorBgContainer: (() => {
                                    if (KeyName === 'ofwcountry' && selected) {
                                        const selectedOption = filteredOptions.find(x => x.value === selected);
                                        if (selectedOption?.negative === 1) {
                                            return '#ff0000'; // Negative case
                                        }
                                        return '#ffffff'; // Positive case
                                    }
                                    return disabled ? '#f5f5f5' : '#ffffff'; // Default cases
                                })(),
                            },
                        },
                    }}
                >
                <Select
                    ref={inputRef}
                    className='text-left'
                    options={newOptions}
                    value={value || undefined}
                    disabled={disabled}
                    size='large'
                    placeholder={placeHolder}
                    onChange={handleSelectChange}
                    onBlur={handleBlur}
                    onFocus={() => setDropdownVisible(true)}
                    showSearch={showSearch}
                    filterOption={false}
                    onSearch={handleSearch}
                    onKeyDown={handleKeyDown}
                    readOnly={readOnly}
                    open={dropdownOpen}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    status={!disabled && (required || required === undefined) ? status : false}
                    style={{ width: '100%' }}
                    suffixIcon={
                        isRendered && !disabled && (required || required === undefined) && status === 'error' ? (
                            <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                        ) : isRendered && !disabled && (required || required === undefined) && status === '' ? (
                            <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                        ) : null
                    }
                />
                {!disabled && (required || required === undefined) && status === 'error' && (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {notValidMsg || notValid}
                    </div>
                )}
            </ConfigProvider>
        </div>
        </div >
    );
}

export default SelectOpt;