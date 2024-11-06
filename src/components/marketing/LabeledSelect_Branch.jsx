import * as React from 'react'
import { Select } from 'antd'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelect_Branch({rendered, showSearch, custom_options,placeHolder, label, value, receive,mod, disabled, readOnly, category, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('')
    const [getIcon, setIcon] = React.useState(false)
    let getItem = value;

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

    // Move the useQuery hook initialization above its first reference
    const branchList = useQuery({
        queryKey: ['BranchListQuery'],
        queryFn: async () => {
            const result = await axios.get('/getBranchList');
            return result.data.list;
        },
        refetchInterval: 1000,
        retryDelay: 1000,
    });

    function facebook() {
        let fb = [{
            value: 11,
            label: 'Facebook'
        }]
        if (!mod) {
            fb = []
        }
        branchList.data?.map((x) => {
            fb.push({
                value: x.code,
                label: x.name,
            })
        })
        return fb
    }
    React.useEffect(() => {
        if(rendered){
            setIcon(true)
        if (!value) { setStatus('error') }
        else { setStatus('') }
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
                    options={facebook()}
                    value={value || undefined}
                    disabled={disabled}
                    size='large'
                    placeholder={placeHolder}
                    showSearch={ showSearch}
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
    )
}

export default LabeledSelect_Branch
