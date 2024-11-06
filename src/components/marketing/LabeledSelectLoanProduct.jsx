import * as React from 'react';
import { Select, ConfigProvider, Input } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelectLoanProduct({
    label,
    value,
    receive,
    disabled,
    category,
    className_dmain,
    className_label,
    className_dsub,
    placeHolder,
    readOnly,
    rendered,
    required,
    showSearch
}) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value;

    function onChange(e) {
        getItem = e
        setIcon(false)
        if (!e) {
            setStatus('error')
            setIcon(true)
            receive()

        }
        else {
            setStatus('')
            setIcon(true)
            receive(e)
        }
    }

    const { data } = useQuery({
        queryKey: ['getProductSelect'],
        queryFn: async () => {
            const result = await GET_LIST('/getListLoanProduct');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });
    function onBlur() {
        setIcon(true)
        if (!getItem) { setStatus('error') }
        else { setStatus('') }
    }

    React.useEffect(() => {
        if (rendered) {
            setIcon(false)
            if (!getItem) {
                setStatus('error')
                setIcon(true)
            }
            else {
                setStatus('')
                setIcon(true)
            }
        }
    }, []);

    return (
        <div className={className_dmain}>
           <div><label className={className_label}>{label}</label></div>
            <div className={className_dsub} >
                {disabled
                ? (<Input
                    readOnly={disabled}
                    className={`w-full ${disabled ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    value={!value ? '' : value === '0303-DH' ? 'DH - Abroad' : 
                                            value === '0303-DHW' ? 'DH - In the Philippines' :
                                                value === '0303-VA' ? 'Seafarer Loan - Deployed' :
                                                    value === '0303-VL' ? 'Seafarer Loan - In the Philippines' :
                                                        value === '0303-WA' ? 'OFW Loan - Abroad' : 'OFW Loan - In the Philippines'

                    }
                    
                    size="large"
                    placeholder={placeHolder}
                    autoComplete="off"
                    style={{ width: '100%' }}
                />
                
                ) : (<ConfigProvider theme={{
                    components: {
                        Select: {
                            colorBgContainer: disabled ? '#f5f5f5' : '#ffffff',
                        },
                    },
                }}>
                
                    <Select 
                    className='text-left'
                    options={data?.map(x => ({ value: x.code, label: x.description }))}
                    value={value || undefined}
                    disabled={disabled}
                    size='large'
                    placeholder={placeHolder}
                    onChange={(e) => { onChange(e) }}
                    onBlur={(e) => { onBlur(e) }}
                    showSearch={showSearch}
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    readOnly={readOnly}
                    status={!readOnly && (required || required === undefined) ? getStatus : false}
                    style={{ width: '100%' }}
                    suffixIcon={
                        !readOnly && (required || required === undefined) ? (
                        getIcon === true
                            ? getStatus === 'error'
                                ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                            : (<></>)) : (<></>)
                    }
                />
                {   !readOnly && (required || required === undefined) ? (
                    getStatus === 'error'
                        ? (
                            <div className='text-xs text-red-500 pt-1 pl-2'>
                                {placeHolder +" Required"}
                        </div>)
                        : (<></>)) : (<></>)
                }
                </ConfigProvider>)
}
            </div>
        </div>
    );
}

export default LabeledSelectLoanProduct; 
