import React, { useState } from 'react';
import { Select, ConfigProvider } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import SelectComponentTabHooks from '@hooks/SelectComponentTabHooks';
import PreLoad, { useDataContainer } from '@context/PreLoad';

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
    rendered,
    required,
    showSearch
}) {
    const [search, setSearchInput] = useState('');
        //Put this in the upper child lvl
    const {GET_LOAN_PRODUCT_LIST} = useDataContainer();
    const dataQuery = GET_LOAN_PRODUCT_LIST?.map(x => ({ value: x.code, label: x.description })) || [];

    const {
        status,
        filteredOptions,
        handleSelectChange,
        handleKeyDown
    } = SelectComponentTabHooks({ search, receive, dataQuery,setSearchInput });

    const handleSearch = (value) => setSearchInput(value);

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
                        status={!readOnly && (required || required === undefined) ? status : false}
                        style={{ width: '100%' }}
                        suffixIcon={
                            !readOnly && (required || required === undefined) && status === 'error' ? (
                                <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                            ) : (
                                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            )
                        }
                    />
                    {!readOnly && (required || required === undefined) && status === 'error' && (
                        <div className='text-xs text-red-500 pt-1 pl-2'>
                            {placeHolder + " Required"}
                        </div>
                    )}
                </ConfigProvider>
            </div>
        </div>
    );
}

export default LabeledSelectLoanProduct;
