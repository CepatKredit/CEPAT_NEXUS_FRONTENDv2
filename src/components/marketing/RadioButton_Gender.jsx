import * as React from 'react'
import { Input } from 'antd'
import { toUpperText } from '@utils/Converter'

function LabeledInput({ label, placeHolder, value, receive }) {

    function onChange(e) {
        receive(e.target.value)
    }

    return (
        <div className='flex flex-rows mt-2 w-[600px]'>
            <label className='mt-[7px] w-[200px]'>{label}</label>
            <div className='mx-[2%] w-[400px]'>
                <Input style={{ width: '100%' }}
                    size='large'
                    value={value}
                    placeholder={placeHolder}
                    onChange={onChange}
                    allowClear
                />
            </div>
        </div>
    )
}

export default LabeledInput