import React from 'react'
import { Input } from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabelDisplay({rendered, label, placeHolder, value, triggerValidation, readOnly, disabled, className_dmain, className_label, className_dsub }) {

    return (
        <div className={className_dmain}>
           <div>
                <label className={className_label}>{label}</label>
            </div>

            <div className={className_dsub}>
               <Input
                    disabled={disabled}
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    readOnly={readOnly}
                    value={value}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    
                />
            </div>
        </div>
    )
}

export default LabelDisplay;
