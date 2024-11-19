import { useQuery } from '@tanstack/react-query'
import { GET_LIST } from '@api/base-api/BaseApi'
import * as React from 'react'
import { Select } from 'antd'


function LabeledSelectLoanProduct({ className, label, value, receive, disabled, readOnly }) {
    function onChangeSelect(e) {
        console.log(e)
        receive(e);  // Ipadala ang value sa parent component
    }

    const getProductSelect = useQuery({
        queryKey: ['getProductSelect'],
        queryFn: async () => {
            const result = await GET_LIST('/GroupGet/G19LLP');
            console.log(result.list)
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });
    
    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Select
                    style={{
                        width: '100%',
                        backgroundColor: disabled ? 'rgba(0, 235, 106, 0.1)' : 'inherit',
                    }}
                    size='large'
                    placeholder={'Please Select...'}
                    allowClear
                    showSearch
                    options={getProductSelect.data?.map(x => ({
                        value: x.code,
                        label: x.description
                    }))}
                    value={value }
                    onChange={onChangeSelect}
                    disabled={disabled}
                    readOnly={readOnly}
                    receive={receive}
                />
            </div>
        </div>
    )
}

export default LabeledSelectLoanProduct;
