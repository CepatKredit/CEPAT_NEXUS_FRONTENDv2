import React, { useEffect } from 'react';
import { Select, ConfigProvider, Input } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelect_Suffix({rendered, showSearch, required, placeHolder, label, value,readOnly,  receive,disabled, triggerValidation, className_dmain, className_label, className_dsub }) {
    const [status, setStatus] = React.useState('');
    const [icon, setIcon] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);

useEffect(() => {
    if (triggerValidation) {
        //console.log('useeffect triggered: ', {selectedValue, triggerValidation});

        if(!selectedValue) {
            setStatus('error');

        } else {
            setStatus('');
        }
        setIcon(true);
    }
}, [triggerValidation]);


    const { data: suffixOption } = useQuery({
        queryKey: ['getSuffix'],
        queryFn: async () => {
            const result = await GET_LIST('/GET/G28S');
            if (result && result.list) {
                return result.list;
            } else {
                console.error('No list found in result:', result);
                return [];
            }
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });
    

    function onChange(value) {

        setSelectedValue(value);
        receive(value);

        if (!value) {
            setStatus('error');
            setIcon(true);
            receive(undefined);
        } else {
            setStatus('');
            setIcon(true);
         
        }
    }

    function onBlur() {
        setIcon(true);
        if (!selectedValue) {
            setStatus('error');
        } else {
            setStatus('');
        }
    }

    React.useEffect(() => {
        if(rendered){
            setIcon(false)
            onBlur()
        }
    }, []);

    return (
        <div className={className_dmain}>
        <div>
            <label className={className_label}>{label}</label>
        </div>
    <div className={className_dsub}>
        {disabled
        ? (<Input
            readOnly={disabled}
            className={`w-full ${disabled ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
            value={!selectedValue ? ''
                :selectedValue === 1 
                ? 'Jr.' 
                : selectedValue === 2 
                    ? 'Sr.'
                    : selectedValue === 3 
                        ? 'I.' 
                        : selectedValue === 4 
                            ? 'II.'
                            : selectedValue === 5
                                 ? 'III.'
                                 : 'IV.'
            }                    
            size="large"
            placeholder={placeHolder}
            autoComplete="off"
            style={{ width: '100%' }}
        />
        
        ) : (
        <ConfigProvider theme={{
            components: {
                Select: {
                    colorBgContainer: disabled ? '#f5f5f5' : '#ffffff',
                },
            },
        }}>
            <Select
                options={suffixOption ? suffixOption.map((x) => ({
                    label: x.description,
                    value: x.code,
                })) : []}
                value={selectedValue || undefined}
                className='w-full text-left'
                size='large'
                disabled={disabled}
                placeholder={placeHolder}
                showSearch={showSearch}
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                onChange={onChange}
                onBlur={onBlur}
                status={!disabled && (required || required === undefined) ? status : undefined}
                suffixIcon={
                    !disabled && (required || required === undefined) ? (
                        icon ? (
                            status === 'error' ? (
                                <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                            ) : (
                                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            )
                        ) : null
                    ) : null
                }
            />
        </ConfigProvider>)
}
        {!disabled && (required || required === undefined) && status === 'error' ? (
            <div className='text-xs text-red-500 pt-1 pl-2'>
                {placeHolder + " Required"}
            </div>
        ) : null}
    </div>
</div>
);
}

export default LabeledSelect_Suffix;
