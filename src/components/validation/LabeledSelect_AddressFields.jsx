import * as React from 'react'
import { Select } from 'antd'

function LabeledSelect_HDisplay({ className, label, data, value, receive, disabled, readOnly ,options,placeHolder}) {
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
                    placeholder={placeHolder}
                    allowClear
                    showSearch
                    options={options}
                    value={value || undefined}
                    onChange={onChangeSelect}
                    disabled={disabled}
                    readOnly={readOnly}
                />
            </div>
        </div>
    )
}

export default LabeledSelect_HDisplay