import * as React from 'react';
import { Input, Form } from 'antd';
import { toUpperText } from '@utils/Converter';

function LabeledInput({ className, label, placeHolder, value, receive, disabled, readOnly, type }) {
    const [inputValue, setInputValue] = React.useState(value);
    const [showHelpText, setShowHelpText] = React.useState(false);
    const [validateStatus, setValidateStatus] = React.useState('');

    function onChange(e) {
        let newValue = e.target.value;

        // Check for case-insensitive 'notuppercase' type
        if (type && type.toLowerCase() === 'notuppercase') {
            setInputValue(newValue); // Set raw input
            receive(newValue); // Pass the raw input
        } else {
            const upperValue = toUpperText(newValue);
            setInputValue(upperValue); // Set uppercase input
            receive(upperValue); // Pass the converted uppercase input
        }

        // Real-time validation
        if (newValue) {
            setShowHelpText(false); // Hide help text when there's input
            setValidateStatus('success'); // Set checkmark icon when input is valid
        } else {
            setValidateStatus('error'); // Set error status when input is empty
        }
    }

    function onBlur() {
        if (!inputValue) {
            setShowHelpText(true); // Show help text when value is empty
            setValidateStatus('error'); // Set error status when input is invalid
        }
    }

    const backgroundStyle = {
        width: '100%',
        backgroundColor: disabled ? 'rgba(0, 235, 106, 0.1)' : 'inherit',
        border: showHelpText ? '1px solid red' : '1px solid #d9d9d9', // Red border if help text is shown
    };

    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Form.Item
                    validateStatus={validateStatus}
                    hasFeedback // Show feedback (checkmark) icon
                >
                    <Input
                        style={backgroundStyle}
                        size='large'
                        value={inputValue}
                        placeholder={placeHolder}
                        onChange={onChange}
                        onBlur={onBlur}
                        allowClear={false} // Remove the clear (x) icon
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </Form.Item>
            </div>
            {showHelpText && (
                <div style={{ color: 'red', marginTop: '8px' }}>
                    This field is required.
                </div>
            )}
        </div>
    );
}

export default LabeledInput;
