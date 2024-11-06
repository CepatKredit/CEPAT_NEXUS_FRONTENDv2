import * as React from 'react'
import { Input } from 'antd'


function LabeledInput_Contact({ label, value, receive, api, placeHolder }) {
    function onChangeValue(e) {
        let num = e.target.value.replace(/[^0-9]/g, '');
        num == '0'? num = '09': num

        if (!num.startsWith('09')) {
            num = '09' + num;
        } else {
            num = '09' + num.slice(2);
        }
        if (num.length > 11) {
            num = num.slice(0, 11);
        }
        receive(num);
    }

    function outfocus(e) {
        let num = e.target.value;
        const reg = /^09\d{9}$/;
        if (!num.match(reg) ) {
            receive()
            if (e.target.value != '09') {
                api['warning']({
                    message: 'Invalid Input',
                    description: 'Please check the Contact Number'
                });
            }
        }
    }
   

    return (
        <div className='flex flex-rows mt-2 w-[600px]'>
            <label className='mt-[7px] w-[200px]'>{label}</label>
            <div className='mx-[2%] w-[400px]'>
                <Input
                    value={value? value:'09'}
                    onChange={onChangeValue}
                    size='large'
                    allowClear
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    receive={receive}
                    onBlur={outfocus}

                />
            </div>
        </div>
    )
}

export default LabeledInput_Contact