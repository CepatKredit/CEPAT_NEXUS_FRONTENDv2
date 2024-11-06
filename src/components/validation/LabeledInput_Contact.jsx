import * as React from 'react';
import { Input, Form } from 'antd';

function LabeledInput_Contact({ label, value = '09', receive, placeHolder, type, className, disabled, readOnly }) {
    const [inputValue, setInputValue] = React.useState(value);
    const [validateStatus, setValidateStatus] = React.useState('');
    const [helpText, setHelpText] = React.useState('');

    const onChangeValue = (e) => {
        let newValue = e.target.value;

        // Ensure that the first two characters remain '09'
        if (newValue.length < 2) {
            newValue = '09';
        } else if (!newValue.startsWith('09')) {
            newValue = '09' + newValue.slice(2);
        }

        // Limit input to 11 characters total and allow only numbers
        if (newValue.length <= 11 && /^[0-9]*$/.test(newValue)) {
            setInputValue(newValue);

            // Real-time validation for contact number length
            if (newValue.length !== 11) {
                setValidateStatus('error');
                setHelpText('The contact number must be exactly 11 digits');
            } else {
                setValidateStatus('success');
                setHelpText('');
            }
        }
    };

    const backgroundStyle = {
        width: '100%',
        backgroundColor: disabled ? 'rgba(0, 235, 106, 0.1)' : 'inherit',
    };

    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Form.Item
                    validateStatus={validateStatus}
                    help={helpText}
                    hasFeedback
                >
                    <Input
                        value={inputValue}
                        onChange={onChangeValue}
                        size='large'
                        allowClear={false} // Disable the clear (x) icon
                        placeholder={placeHolder}
                        autoComplete='off'
                        style={backgroundStyle}
                        receive={receive}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </Form.Item>
            </div>
        </div>
    );
}

export default LabeledInput_Contact;
