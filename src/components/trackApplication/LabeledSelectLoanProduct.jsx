import * as React from 'react';
import { Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

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
    options
}) {
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value;

    function onChange(e) {
        getItem = e
        setIcon(false)
        if (!e) {
            setStatus('error')
            setIcon(true)
            updateAppDetails({ name: "loanProd", value: null })

        }
        else {
            setStatus('')
            setIcon(true)
            updateAppDetails({ name: "loanProd", value: e })
        }
    }


    const ProductList = useQuery({
        queryKey: ['getProductSelect'],
        queryFn: async () => {
            const result = await GET_LIST('/api/GET/G19LLP');
            return result.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    function onBlur() {
        setIcon(true)
        if (!getItem) { setStatus('error') }
        else { setStatus('') }
    }

    return (
        <div className={className_dmain}>
            {category === 'marketing' && <div><label className={className_label}>{label}</label></div>}
            {category === 'direct' && <label className={className_label}>{label}</label>}
            <div className={className_dsub} >

                <Select
                    options={ProductList.data?.map(x => ({ value: x.code, label: x.description }))}
                    value={value || undefined}
                    disabled={disabled}
                    size='large'
                    placeholder={placeHolder}
                    onChange={(e) => { onChange(e) }}
                    onBlur={(e) => { onBlur(e) }}
                    readOnly={readOnly}
                    status={getStatus}
                    style={{ width: '100%' }}
                    suffixIcon={
                        getIcon === true
                            ? getStatus === 'error'
                                ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                            : (<></>)
                    }
                />
                {
                    getStatus === 'error'
                        ? (
                            <div className='text-xs text-red-500 pt-1 pl-2'>
                                {placeHolder + " Required"}
                            </div>)
                        : (<></>)
                }
            </div>
        </div>
    );
}

export default LabeledSelectLoanProduct; 
