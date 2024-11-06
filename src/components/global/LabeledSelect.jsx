import * as React from 'react'
import { Select } from 'antd'

function LabeledSelect({ className,label, data, value, receive, disabled,readOnly,filterOption }) {
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
                    filterOption={filterOption}
                    options={data?.map(x => ({
                        value: x.value,
                        label: x.label
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

export default LabeledSelect