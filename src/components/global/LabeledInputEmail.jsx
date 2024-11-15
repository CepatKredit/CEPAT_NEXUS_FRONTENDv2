import * as React from 'react'
import { Input, Tooltip } from 'antd'

function LabeledInputEmail({ className, label, placeHolder, value, receive, disabled, readOnly }) {

    const [getValid, setValid] = React.useState(false)
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const [getTitle, setTitle] = React.useState('Please input the email');
    function onChange(e) {
        receive(e.target.value)
        if (value && value.match(isValidEmail)) {
            setValid(false);
            setTitle('Email is valid')
        }
        else {
            setValid(true);
            setTitle('Email is not valid')
        }
    }
    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Tooltip title={getTitle}>
                    <Input style={{ width: '100%' }}
                        status={getValid === false || value === ''
                            ? '' : 'warning'}
                        size='large'
                        value={value}
                        onMouseOver={() => { setTitle('Please input the email') }}
                        placeholder={placeHolder}
                        onChange={onChange}
                        allowClear
                        autoComplete="new-password"
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </Tooltip>
            </div>
        </div>
    )
}


export default LabeledInputEmail