import * as React from 'react';
import { Select, Form } from 'antd';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function LabeledSelect({ className, label, data, value, receive, disabled, readOnly }) {
    const { getAppDetails } = React.useContext(LoanApplicationContext)
    const [showHelpText, setShowHelpText] = React.useState(false);
    const [validateStatus, setValidateStatus] = React.useState('');

    console.log("Status", getAppDetails.loanStatus)

    function onChangeSelect(e) {
        receive(e);

        // Real-time validation
        if (e) {
            setShowHelpText(false);
            setValidateStatus('success'); // Set checkmark icon when a valid option is selected
        } else {
            setValidateStatus('error'); // Set error when no option is selected
        }
    }

    function onBlur() {
        if (!value) {
            setShowHelpText(true);
            setValidateStatus('error'); // Set error status if value is empty
        }
    }

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
                    hasFeedback // Show feedback (checkmark) icon
                >
                    <Select
                        style={backgroundStyle}
                        size='large'
                        placeholder={'Please Select...'}
                        showSearch
                        options={data?.map(x => ({
                            value: x.value,
                            label: x.label
                        }))}
                        value={value || undefined}
                        onChange={onChangeSelect}
                        onBlur={onBlur}
                        disabled={disabled}
                        readOnly={readOnly}
                        allowClear={false} // Remove the clear (x) icon
                    />
                </Form.Item>
            </div>
            {showHelpText && (
                <div style={{ color: 'red', marginTop: '8px' }}>
                    This field is required
                </div>
            )}
        </div>
    );
}

export default LabeledSelect;
