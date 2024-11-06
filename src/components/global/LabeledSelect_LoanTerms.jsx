import * as React from 'react'
import { Select } from 'antd'

function LabeledSelect_LoanTerms({ label, data, value, receive,name }) {
    function onChangeSelect() {
    }
    const data_terms = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((term) => ({
        name: term,
        value: term
    }))

  
    
    return (
        <div className='flex flex-rows mt-2 w-[600px]'>
            <label className='mt-[7px] w-[200px]'>{label}</label>
            <div className='mx-[2%] w-[400px]'>
                <Select style={{ width: '100%' }}
                    size='large'
                    allowClear
                    showSearch
                    options={data_terms}
                    value={value || undefined}
                    onChange={onChangeSelect}
                    placeholder={'Min. of 3 months Max of 12 months'}

                />
            </div>
        </div>
    )
}

export default LabeledSelect_LoanTerms