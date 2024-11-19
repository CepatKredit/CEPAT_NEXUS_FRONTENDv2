import * as React from 'react'
import { Input } from 'antd'
import { toUpperText } from '@utils/Converter'

function LabeledInput({ className, label, placeHolder, value, receive, disabled ,readOnly}) {
    function onChange(e) {
        receive(toUpperText(e.target.value))
    }
    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Input style={{ width: '100%' }}
                    size='large'
                    value={value}
                    autoComplete="new-password"
                    placeholder={placeHolder}
                    onChange={onChange}
                    allowClear
                    disabled={disabled}
                    readOnly={readOnly}
                />
            </div>
        </div>
    )
}

export default LabeledInput