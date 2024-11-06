import * as React from 'react'
import { Select } from 'antd'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';


function LabeledSelect_Province({ label, placeHolder, value, receive, disabled, readOnly, options, className_dmain, className_dsub, className_label }) {

    function onChangeSelect(e) {
        receive(e)
    }
    // className='flex flex-rows mt-2 w-[600px]'
    //label className='mt-[7px] w-[200px]'
    //className='mx-[2%] w-[400px]'

    return (
        <div className={className_dmain}>
            <label className={className_label}>{label}</label>
            <div className={className_dsub}>
                <Select style={{ width: '100%' }}
                    size='large'
                    placeholder={placeHolder}
                    allowClear
                    showSearch
                    options={options}
                    disabled={disabled}
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    value={value || undefined}
                    onChange={onChangeSelect}

                />
            </div>
        </div>
    )
}

export default LabeledSelect_Province