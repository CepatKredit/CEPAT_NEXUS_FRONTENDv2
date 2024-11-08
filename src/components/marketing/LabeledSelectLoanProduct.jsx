import React, { useCallback, useState } from 'react';
import { Select, ConfigProvider } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import ComponentHooks from '@hooks/ComponentHooks';
import { debounce } from '@utils/Debounce';

function LabeledSelectLoanProduct({
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
    notValid
}) {
    const [search, setSearchInput] = useState('');
    const {
        status,
        filteredOptions,
        handleSelectChange,
        handleKeyDown
    } = ComponentHooks({ search, receive, options, setSearchInput });

    const debouncedSearch = useCallback(
        debounce((value) => setSearchInput(value), 300),
        []
    );

    const handleSearch = (value) => {
        debouncedSearch(value);
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
                        className='text-left'
                        options={filteredOptions}
                        value={value || undefined}
                        disabled={disabled}
                        size='large'
                        placeholder={placeHolder}
                        onChange={handleSelectChange}
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
                            ) : (
                                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            )
                        }
                    />
                    {!disabled && (required || required === undefined) && status === 'error' && (
                        <div className='text-xs text-red-500 pt-1 pl-2'>
                            {notValid}
                        </div>
                    )}
                </ConfigProvider>
            </div>
        </div>
    );
}

export default LabeledSelectLoanProduct;
