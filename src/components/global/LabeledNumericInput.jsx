import * as React from 'react'
import { Input } from 'antd'

function LabeledNumericInput({ className, label, placeHolder, value, receive, disabled,readOnly }) {
    function onChangeValue(e) {
        receive(e.target.value.replace(/[^0-9]/g, ''))
    }
    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Input
                    value={value}
                    onChange={onChangeValue}
                    size='large'
                    allowClear
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    disabled={disabled}
                    readOnly={readOnly}
                />
            </div>
        </div>
    )
}

export default LabeledNumericInput