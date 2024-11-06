import * as React from 'react'
import { Input } from 'antd'
import { toUpperText } from '@utils/Converter'

function LabeledTextArea({ className, label, placeHolder, value, receive, disabled, readOnly }) {
    function onChange(e) {
        receive(toUpperText(e.target.value))
    }
    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Input.TextArea
                    className='w-full h-[10rem]'
                    size='large'
                    value={value}
                    placeholder={placeHolder}
                    onChange={onChange}
                    allowClear
                    disabled={disabled}
                    readOnly={readOnly}
                    style={{ resize: 'none' }}
                    showCount
                    maxLength={1000}
                />
            </div>
        </div>
    )
}

export default LabeledTextArea