import * as React from 'react'
import { Input } from 'antd'

function LabeledNumericInput({ className, label, placeHolder, value, receive, disabled, readOnly }) {
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
                    style={{
                        width: '100%',
                        backgroundColor: disabled ? 'rgba(4, 169, 77, 0.1)' : 'inherit', // Set background color to red if disabled
                    }}
                    value={value}
                    onChange={onChangeValue}
                    size='large'
                    allowClear
                    placeholder={placeHolder}
                    autoComplete='off'
                    disabled={disabled}
                    readOnly={readOnly}
                />
            </div>
        </div>
    )
}

export default LabeledNumericInput