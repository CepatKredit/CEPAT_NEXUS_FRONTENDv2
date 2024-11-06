import * as React from 'react'
import { Input } from 'antd'

function LabeledNumericInput({ label, placeHolder, value, receive }) {
    function onChangeValue(e) {
        receive(e.target.value.replace(/[^0-9]/g, ''))
    }
    return (
        <div className='flex flex-rows mt-2 w-[600px]'>
            <label className='mt-[7px] w-[200px]'>{label}</label>
            <div className='mx-[2%] w-[400px]'>
                <Input
                    value={value}
                    onChange={onChangeValue}
                    size='large'
                    allowClear
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    )
}

export default LabeledNumericInput