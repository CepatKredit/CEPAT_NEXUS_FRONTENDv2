import * as React from 'react';
import { Select, Input, ConfigProvider } from 'antd';
import { useQuery } from '@tanstack/react-query'
import { GET_LIST } from '@api/base-api/BaseApi'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelect_Consultant({ rendered, required, placeHolder, className, label, data, value, receive, disabled, readOnly, category, className_dmain, className_label, className_dsub, showSearch }) {
    const [status, setStatus] = React.useState('');
    const [icon, setIcon] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || '');


    const { data: consultantData } = useQuery({
        queryKey: ['getLoanConsultant'],
        queryFn: async () => {
            const result = await GET_LIST('/api/GET/G21LC');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });

    function GetConsultant() {
        var data = consultantData?.find((x) => {
            if (x.fullName === selectedValue || x.id === selectedValue) { return x.fullName }
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
    React.useEffect(() => {
        if(rendered){
            onBlur()
        }
    }, []);

    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>

            <div className={className_dsub}>


               
                        <ConfigProvider theme={{
                            components: {
                                Select: {
                                    colorBgContainer: disabled ? '#f5f5f5' : '#ffffff',
                                },
                            },
                        }}>
                            <Select
                                options={consultantData ? consultantData.map((x) => ({
                                    value: x.id,
                                    label: x.fullName
                                })) : []}
                                value={selectedValue || undefined}
                                className='w-full text-left'
                                size='large'
                                disabled={disabled}
                                placeholder={placeHolder}
                                showSearch={showSearch}
                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                onChange={onChange}
                                //onBlur={onBlur}
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
                        </ConfigProvider>
                
                {!disabled && (required || required === undefined) && status === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder + " Required"}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
export default LabeledSelect_Consultant;
