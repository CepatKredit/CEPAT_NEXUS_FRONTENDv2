import * as React from 'react'
import { Select } from 'antd'
function MultiSelect({ className, label, data, count, value, receive, disabled,readOnly }) {

    function onChangeSelect(e) {
        receive(e)
    }
    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Select style={{ width: '100%' }}
                    size='large'
                    placeholder={'Please Select...'}
                    allowClear
                    showSearch
                    maxCount={value.includes('ALL') ? 1 : value.count - 1}
                    maxTagCount={count}
                    mode={'multiple'}
                    value={value.includes('ALL') ? ['ALL'] : value || undefined}
                    onChange={onChangeSelect}
                    disabled={disabled}
                    readOnly={readOnly}
                    options={data?.map((x) => ({
                        value: x.value,
                        label: x.label
                    }))} />
            </div>
        </div>
    )
}

export default MultiSelect