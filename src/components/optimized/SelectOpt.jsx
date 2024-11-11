import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
    keyName,
}) {
    const [search, setSearchInput] = useState('');

    const inputRef = useRef(null);
    const { setfocus } = useContext(LoanApplicationContext)
    useEffect(() => {
        setfocus(KeyName, inputRef.current);
    }, [KeyName, setfocus])

    const {
        status,
        filteredOptions,
        handleSelectChange,
        handleKeyDown
    } = SelectComponentHooks( search, receive, options, setSearchInput,keyName||KeyName );

    const debouncedSearch = useCallback(
        debounce((value) => setSearchInput(value), 300),
        []
    );

    const handleSearch = (value) => {
        debouncedSearch(value);
    };

    const handleBlur = () => {
        if (required && !value) {
            handleSelectChange('')
        }
    };

    return (
        <div className={className_dmain}>
            <label className={className_label}>{label}</label>
            <div className={className_dsub}>
                <ConfigProvider theme={{
                    components: {
                        Select: {
                            colorBgContainer: disabled ? '#f5f5f5' : '#ffffff',
                        },
                    },
                }}>
                    <Select
                        ref={inputRef}
                        className='text-left'
                        options={filteredOptions}
                        value={value || undefined}
                        disabled={disabled}
                        size='large'
                        placeholder={placeHolder}
                        onChange={handleSelectChange}
                        onBlur={handleBlur}
                        showSearch={showSearch}
                        filterOption={false}
                        onSearch={handleSearch}
                        onKeyDown={handleKeyDown}
                        readOnly={readOnly}
                        status={!disabled && (required || required === undefined) ? status : false}
                        style={{ width: '100%' }}
                        suffixIcon={
                            !disabled && (required || required === undefined) && status === 'error' ? (
                                <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                            ) : status === '' ? (
                                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            ): null
                        }
                    />
                    {!disabled && (required || required === undefined) && status === 'error' && (
                        <div className='text-xs text-red-500 pt-1 pl-2'>
                            {notValidMsg || notValid}
                        </div>
                    )}
                </ConfigProvider>
            </div>
        </div>
    );
}

export default SelectOpt;
