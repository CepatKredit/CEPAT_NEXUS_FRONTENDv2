import * as React from 'react';
import { Select, Tooltip, Form } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';

const { Option } = Select;

function LabeledSelectAgency({ className, label, value, receive, disabled, readOnly }) {
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

    // Fetch agency data
    const getAgency = useQuery({
        queryKey: ['getAgency'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/GetAgency');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });

    // Create the options with custom styles based on agencyStatus
    const agencyOptions = getAgency.data
        ? getAgency.data.map((x) => ({
            label: x.name,
            value: x.id,
            status: x.agencyStatus,
            remarks: x.remarks,
        }))
        : [];

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
                        value={value || undefined}
                        onChange={onChangeSelect}
                        onBlur={onBlur}
                        disabled={disabled}
                        readOnly={readOnly}
                    >
                        {agencyOptions.map((option) => {
                            const optionContent = (
                                <div
                                    style={{
                                        backgroundColor: option.status === 1 ? 'red' : option.status === 2 ? 'orange' : 'white',
                                        color: option.status === 1 || option.status === 2 ? 'white' : 'black',
                                    }}
                                >
                                    {option.label}
                                </div>
                            );

                            return (
                                <Option key={option.value} value={option.value}>
                                    {option.status === 1 || option.status === 2 ? (
                                        <Tooltip
                                            title={`Reason: ${option.remarks}`}
                                            placement="right"
                                            overlayInnerStyle={{
                                                backgroundColor: option.status === 1 ? 'red' : 'orange',
                                                color: 'white',
                                            }}
                                        >
                                            {optionContent}
                                        </Tooltip>
                                    ) : (
                                        optionContent
                                    )}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
            </div>
        </div>
    );
}

export default LabeledSelectAgency;
