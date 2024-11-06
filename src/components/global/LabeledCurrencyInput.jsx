    import * as React from 'react'
    import { Input } from 'antd'

    function LabeledCurrencyInput({ className, label, value, receive, disabled,readOnly }) {
        function onChangeValue(e) {
            let num = e.target.value.replace(/[^0-9.]/g, '');
    
            if (num.includes('.')) {
                let [integerPart, decimalPart] = num.split('.');
                decimalPart = decimalPart.slice(0, 6); 
                integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                num = `${integerPart}.${decimalPart}`;
            } else {
                num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
    
            receive(num);
        }


        return (
            <div className={className}>
                <div>
                    <label className='font-bold'>{label}</label>
                </div>
                <div>
                    <Input
                        value={value}
                        onChange={onChangeValue}
                        size='large'
                        allowClear
                        placeholder='0.00'
                        autoComplete='off'
                        style={{ width: '100%' }}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
            </div>
        )
    }

    export default LabeledCurrencyInput