import * as React from 'react';
import { Select, Input, ConfigProvider } from 'antd';
import { useQuery } from '@tanstack/react-query'
import { GET_LIST } from '@api/base-api/BaseApi'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelectLoanPurpose({rendered, required, label, value, placeHolder, receive, disabled, readOnly, category, className_dmain, className_label, className_dsub, showSearch }) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value;

    function onChange(e) {
        getItem = e
        setIcon(false)

        if (!e) {
            setStatus('error')
            setIcon(true)
        }
        else {
            setStatus('')
            setIcon(true)
            receive(e)

        }
    }
    function onBlur() {
        setIcon(true)
        if (!getItem) { setStatus('error') }
        else { setStatus('') }
    }

    const data = useQuery({
        queryKey: ['getLoanPurpose'],
        queryFn: async () => {
            const result = await GET_LIST('/getLoanPurpose');

            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });

    React.useEffect(() => {
        if(rendered){
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
                {disabled ? (

                    <Input
                        readOnly={disabled}
                        className={`w-full ${disabled ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                        value={!value ? '' : value === 1 ? 'Asset Acquisition' :
                            value === 2 ? 'Bills Expense' :
                                value === 3 ? 'Burial/Funeral Expense' :
                                    value === 4 ? 'Business Capital/Investment (Start up, addtnl Capital)' :
                                        value === 5 ? 'Educational Expense' :
                                            value === 6 ? 'Family/Household Expenses' :
                                                 value === 7 ? 'Financial Assistance/Support' :
                                                    value === 8 ? 'House/Home Renovation/Construction' :
                                                        value === 9 ? 'Interest Payment' :
                                                            value === 10 ? 'Maintenance Expense' :
                                                                value === 11 ? 'Medical/Hospital Expenses' :
                                                                    value === 12 ? 'Personal Use/Expense' :
                                                                        value === 13 ? 'Pocket Money/Travel Expense' : 'Wedding Expense'

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

                    < Select
                    className='text-left'
                    options={data.data?.map(x => ({ value: x.id, label: x.purpose }))}
                value={value || undefined}
                disabled={disabled}
                size='large'
                placeholder={placeHolder}
                onChange={(e) => { onChange(e) }}
                onBlur={(e) => { onBlur(e) }}
                readOnly={readOnly}
                status={!readOnly && (required || required === undefined) ? getStatus : false}
                showSearch={showSearch}
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
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
                { !readOnly && (required || required === undefined) ? (
                    getStatus === 'error'
                        ? (<div className='text-xs text-red-500 pt-1 pl-2'>
                            {placeHolder + " Required"}
                        </div>)
                        : (<></>)) : (<></>)
                }
                </ConfigProvider>)
}
            </div>
        </div>
    )
}

export default LabeledSelectLoanPurpose