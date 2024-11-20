import * as React from 'react';
import { Select, Form, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query'
import { GET_LIST } from '@api/base-api/BaseApi'

function LabeledSelect_Consultant({ className, label, data,value, receive, disabled, readOnly, category, className_dmain, className_label, className_dsub }) {
    const [showHelpText, setShowHelpText] = React.useState(false);
    const [validateStatus, setValidateStatus] = React.useState('');
    const [tooltipVisible, setTooltipVisible] = React.useState(false);

    const getLoanConsultant = useQuery({
        queryKey: ['getLoanConsultant'],
        queryFn: async () => {
            const result = await GET_LIST('/api/GET/G21LC');
            console.log(result.list)
            return result.list;
        },
        refetchInterval:  1000,
        retryDelay: 1000,
    });
    function onChangeSelect(e) {
        receive(e);

        // Real-time validation
        if (e) {
            setShowHelpText(false);
            setTooltipVisible(false); // Hide tooltip when valid option is selected
            setValidateStatus('success'); // Set checkmark icon when a valid option is selected
        } else {
            setShowHelpText(true);
            setTooltipVisible(true); // Show tooltip when no option is selected
            setValidateStatus('error'); // Set error when no option is selected
        }
    }

    function onBlur(e) {
        if (!e) {
            setShowHelpText(true);
            setTooltipVisible(true); // Ensure tooltip is visible when input is empty
            setValidateStatus('error'); // Set error status if value is empty
        } else {
            setTooltipVisible(false); // Hide tooltip when there is a valid value
        }
    }

    const backgroundStyle = {
        width: '100%',
        backgroundColor: disabled ? '#f5f5f5' : 'inherit',
        border: validateStatus === 'error' ? '1px solid red' : '1px solid #d9d9d9',
        borderRadius: '8px',
    };

    const tooltipContent = "This field is required.";

    return (
        <div className={className_dmain}>
            {category === 'marketing'
                ? (<div>
                    <label className={className_label}>{label}</label>
                </div>)
                : category === "direct"
                    ? (<label className={className_label}>{label}</label>)
                    : null}

            <div className={className_dsub}>
                <Tooltip
                    placement="bottom"
                    visible={tooltipVisible}
                    title={tooltipContent}
                >
                    <Form.Item
                        validateStatus={validateStatus}
                        hasFeedback // Show feedback (checkmark) icon
                    >
                        <Select
                            style={backgroundStyle}
                            size='large'
                            placeholder={'Please Select...'}
                            allowClear
                            showSearch
                            
                            options={getLoanConsultant.data?.map(x => ({
                                value: x.id,
                                label: x.fullName,
                            }))}
                            value={value || undefined}
                            onChange={onChangeSelect}
                            disabled={disabled}
                            readOnly={readOnly}
                            receive={receive}
                            onBlur={onBlur}
                        />
                    </Form.Item>
                </Tooltip>
            </div>
        </div>
    );
}

export default LabeledSelect_Consultant;
