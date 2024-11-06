import * as React from 'react'
import { Input } from 'antd'
import { toUpperText } from '@utils/Converter'

function LabeledInput_AddressStreet({ className, label, placeHolder, value, receive, disabled, readOnly, onChange, className_label }) {

    return (
        <div className={className}>
            <div>
                <label className={ className_label}>{label}</label>
            </div>
            <div>
                <Input style={{ width: '100%' }}
                    size='large'
                    value={value}
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

export default LabeledInput_AddressStreet