import * as React from 'react'
import { Select } from 'antd'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi'

function LabeledSelect_Barangay({ label, placeHolder, value, receive, disabled, readOnly, data, options, className_dmain, className_dsub, className_label }) {

    function onChangeSelect(e) {
        receive(e)
    }


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
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    value={value || undefined}
                    onChange={onChangeSelect}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

export default LabeledSelect_Barangay