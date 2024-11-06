import * as React from 'react';
import { Select, Form, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query'
import { GET_LIST } from '@api/base-api/BaseApi'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelect_Relationship({rendered, showSearch, placeHolder, label, value, receive, disabled, readOnly, category, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value;

    const getRelationship = useQuery({
        queryKey: ['getRelationship'],
        queryFn: async () => {
            const result = await GET_LIST('/getListRelationship');
            return result.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    function onChange(e) {
        receive(e)
        getItem = e

        if (!e) {
            setStatus('error')
            setIcon(true)
        }
        else {
            setStatus('')
            setIcon(true)
        }
    }

    function onBlur() {
        setIcon(true)
        if (!getItem) { setStatus('error') }
        else { setStatus('') }
    }

    React.useEffect(() => {
        if(rendered ){
            onBlur()
        }
    }, []);

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
                
                <Select
                    style={{ width: '100%' }}
                    options={getRelationship.data ? getRelationship.data.map((x) => ({
                        label: x.description,
                        value: x.code,
                    })) : []}                    
                    value={value || undefined}
                    disabled={disabled}
                    size='large'
                    placeholder={placeHolder}
                    showSearch={showSearch}
                    onChange={(e) => { onChange(e) }}
                    onBlur={(e) => { onBlur(e) }}
                    readOnly={readOnly}
                    status={getStatus}
                    suffixIcon={
                        getIcon === true
                            ? getStatus === 'error'
                                ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)
                                : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)
                            : (<></>)
                    }
                />
                {
                    getStatus === 'error'
                        ? (<div className='text-xs text-red-500 pt-1 pl-2'>
                            {placeHolder + " Required"}
                        </div>)
                        : (<></>)
                }
                    
            </div>
        </div>
    );
}

export default LabeledSelect_Relationship;
