import * as React from 'react'
import { Select } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { GET_LIST } from '@api/base-api/BaseApi'

function LabeledSelectLoanPurpose({ className,label, value, receive, disabled,readOnly }) {
    function onChangeSelect(e) {
        receive(e)
    };

    const getLoanPurpose = useQuery({
        queryKey: ['getLoanPurpose'],
        queryFn: async () => {
            const result = await GET_LIST('/v1/GET/G20LP');
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
                        backgroundColor: disabled ? 'rgba(0, 235, 106, 0.1)' : 'inherit', // Set background color to red if disabled
                    }}
                    size='large'
                    placeholder={'Please Select...'}
                    allowClear
                    showSearch
                    options={getLoanPurpose.data?.map(x => ({
                        value: x.id,
                        label: x.purpose
                    }))}
                    value={value || undefined}
                    onChange={onChangeSelect}
                    disabled={disabled}
                    readOnly={readOnly}
                />
            </div>
        </div>
    )
}

export default LabeledSelectLoanPurpose