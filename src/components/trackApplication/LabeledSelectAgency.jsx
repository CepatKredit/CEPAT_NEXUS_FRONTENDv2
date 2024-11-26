import * as React from 'react';
import { Select, ConfigProvider, Input, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelectAgency({ showSearch, required, placeHolder, label, value, receive, disabled, readOnly, className_dmain, className_label, className_dsub }) {
    const [status, setStatus] = React.useState('');
    const [icon, setIcon] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);

    const { data: getAgencyOption } = useQuery({
        queryKey: ['getAgency'],
        queryFn: async () => {
            const result = await GET_LIST('/GET/G1A');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });

    function GetDecsAgency() {
        var data = getAgencyOption?.find((x) => {
            if (x.name === selectedValue || x.id === selectedValue) { return x.name }
        })
        return data
    }

    function onChange(value) {

        setSelectedValue(value);
        receive(value);

        if (!value) {
            setStatus('error');
            setIcon(true);
        } else {
            setStatus('');
            setIcon(true);
        }
    }

    function onBlur() {
        setIcon(true);
        if (!selectedValue) {
            setStatus('error');
        } else {
            setStatus('');
        }
    }


    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>
            <div className={className_dsub}>
                {disabled
                    ? (<Input
                        readOnly={disabled}
                        className={`w-full ${disabled ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                        value={GetDecsAgency() === undefined ? '' : GetDecsAgency().name}
                        size="large"
                        placeholder={placeHolder}
                        autoComplete="off"
                        style={{ width: '100%' }}
                    />

                    ) : (
                        <ConfigProvider theme={{
                            components: {
                                Select: {
                                    colorBgContainer: disabled ? '#f5f5f5' : '#ffffff',
                                },
                            },
                        }}>
                            <Select
                                options={getAgencyOption ? getAgencyOption.map((x) => ({
                                    value: x.id,
                                    label: (
                                        <Tooltip
                title={`Reason: ${x.remarks}`}
                placement="left"
                overlayInnerStyle={{
                    backgroundColor: x.agencyStatus === 1 ? 'red' : x.agencyStatus === 0 ? 'white' : x.agencyStatus === 2 ? 'orange' : 'white',
                    color: x.agencyStatus === 0 ? 'black' : 'white' // Ensure the text is visible on the background
                }}
            >
                {x.name}
            </Tooltip>
                                    )
                                })) : []}
                                value={selectedValue || undefined}
                                className='w-full text-left'
                                size='large'
                                disabled={disabled}
                                placeholder={placeHolder}
                                showSearch={showSearch}
                                onChange={onChange}
                                onBlur={onBlur}
                                status={!disabled && (required || required === undefined) ? status : undefined}
                                suffixIcon={
                                    !disabled && (required || required === undefined) ? (
                                        icon ? (
                                            status === 'error' ? (
                                                <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                            ) : (
                                                <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                            )
                                        ) : null
                                    ) : null
                                }
                            />
                        </ConfigProvider>)
                }
                {!disabled && (required || required === undefined) && status === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder + " Required"}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default LabeledSelectAgency;
