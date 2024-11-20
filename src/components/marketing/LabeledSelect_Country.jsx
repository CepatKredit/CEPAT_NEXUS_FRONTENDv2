import * as React from 'react';
import { Select, ConfigProvider, Input } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelect_Country({rendered, showSearch, required, placeHolder, label, value, receive, disabled, readOnly, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value ;

    const getCountrySelect = useQuery({
        queryKey: ['getCountrySelect'],
        queryFn: async () => {
            const result = await GET_LIST('/GroupGet/G26C');
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        enabled: true, // Keep this to true if you want it to run when the component mounts
        retryDelay: 1000, // Wait 1 second between retries
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
            setIcon(false)
            onBlur()
        }
        getCountrySelect.refetch();
    }, []);
    return (
        <div className={className_dmain}>
        <div>
            <label className={className_label}>{label}</label>
        </div>
            <div className={className_dsub}>
                <Select
                    placeholder={placeHolder}
                    options={getCountrySelect.data?.map(x => ({
                        value: x.code,
                        label: x.description
                    }))}
                    value={value || undefined}
                    disabled={disabled}
                    showSearch
                    
                    size='large'
                    onChange={(e) => { onChange(e) }}
                    //onBlur={(e) => { onBlur(e) }}
                    readOnly={readOnly}
                    status={getStatus}
                    style={{ width: '100%' }}
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
                            {placeHolder !== 'Please Select...' ? `${placeHolder} Required` : `Required`}
                        </div>)
                        : (<></>)
                }
            </div>
        </div>
    );
}

export default LabeledSelect_Country;
