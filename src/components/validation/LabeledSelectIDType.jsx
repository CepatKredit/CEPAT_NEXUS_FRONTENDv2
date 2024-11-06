import * as React from 'react';
import { Select, Form } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';

function LabeledSelectIDType({ className, label, value, receive, disabled, readOnly }) {
    const [validateStatus, setValidateStatus] = React.useState(''); // State for validation status
    const [showHelpText, setShowHelpText] = React.useState(false);

    function onChangeSelect(e) {
        receive(e);

        // Real-time validation
        if (e) {
            setShowHelpText(false); // Hide help text when valid option is selected
            setValidateStatus('success'); // Set checkmark icon when valid
        } else {
            setValidateStatus('error'); // Set error status when no valid option is selected
        }
    }

    function onBlur() {
        if (!value) {
            setShowHelpText(true); // Show help text when no value is selected
            setValidateStatus('error'); // Set validation status to error
        }
    }

    const getIDType = useQuery({
        queryKey: ['getIDType'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/getIDtype');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });

    const selectStyle = {
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
                    hasFeedback // Show checkmark when valid
                    help={showHelpText ? 'This field is required.' : ''}
                >
                    <Select
                        style={selectStyle}
                        size='large'
                        placeholder={'Please Select...'}
                        allowClear={false} // Disable the clear (x) icon
                        showSearch
                        options={getIDType.data?.map(x => ({
                            value: x.id,
                            label: x.name,
                        }))}
                        value={value || undefined}
                        onChange={onChangeSelect}
                        onBlur={onBlur}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </Form.Item>
            </div>
        </div>
    );
}

export default LabeledSelectIDType;
