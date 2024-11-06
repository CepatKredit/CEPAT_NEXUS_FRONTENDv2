import * as React from 'react'
import { Select } from 'antd'

function LabeledSelect_MStatus({ label, placeHolder, value, receive, disabled, readOnly }) {
    function onChangeSelect(e) {
        receive(e)
    }
    const suffix = ['Single', 'Married', 'Common Law', 'Live In Partner', 'Widowed', 'Separated']

    return (
        <div className='flex flex-rows mt-2 w-[600px]'>
            <label className='mt-[7px] w-[200px]'>{label}</label>
            <div className='mx-[2%] w-[400px]'>
                <Select style={{ width: '100%' }}
                    size='large'
                    placeholder={placeHolder}
                    allowClear
                    showSearch
                    options={suffix?.map(x => ({
                        value: x,
                        label: x
                    }))}

                    value={value || undefined}
                    onChange={onChangeSelect}
                />
            </div>
        </div>
    )
}

export default LabeledSelect_MStatus