import * as React from 'react';
import { Select, ConfigProvider, Input } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { useDataContainer } from '@context/PreLoad';

function LabeledSelect_CollectionArea({value_mun, value_prov, rendered, showSearch, required, placeHolder, label, value, receive, disabled, readOnly, className_dmain, className_label, className_dsub }) {
    const [status, setStatus] = React.useState('');
    const [icon, setIcon] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value ? value : '');
    const {GET_COLLECTION_AREA_LIST} = useDataContainer();

    // const collectionArea = useQuery({
    //     queryKey: ['collectionArea'],
    //     queryFn: async () => {
    //         const result = await axios.get('/api/GET/G29CA');
    //         return result.data.list;
    //     },
    //     refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    //     enabled: true,
    //     retryDelay: 1000,
    // });



    function onChange(value) {
        setSelectedValue(value);

        if (!value) {
            setStatus('error');
            setIcon(true);
            receive();
        } else {
            setStatus('');
            setIcon(true);
            receive(value);

        }
    }

    React.useEffect(() => {
        console.log(value_prov)
        if (rendered && GET_COLLECTION_AREA_LIST) {
            const filteredData = GET_COLLECTION_AREA_LIST.filter( 
                (y) => y.code !== '130100000'
            );
            const exists = filteredData.some(option => option.code === value_prov);
            if (exists) {
                onChange(value_prov);
            } else if (!exists && value_mun) {
                onChange(value_mun);
            } else {
                onChange();
            }
        }
        
    }, [GET_COLLECTION_AREA_LIST, value_prov,value_mun]);

    React.useEffect(() => {
        if(rendered){
            if (!selectedValue) {
                setStatus('error');
                setIcon(true);
            } else {
                setStatus('');
                setIcon(true);    
            }
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
                        options={
                            GET_COLLECTION_AREA_LIST ? GET_COLLECTION_AREA_LIST
                            .filter((y) =>
                                y.code !== '130100000'
                            )
                            .map((x) => ({
                                value: x.code,
                                label: x.description.toUpperCase(),
                            })) : []
                        }
                        value={selectedValue}
                        className='w-full text-left'
                        size='large'
                        disabled={disabled}
                        placeholder={placeHolder}
                        showSearch={showSearch}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={onChange}
                        status={  !disabled && (required || required === undefined) ? status : undefined}
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
                { !disabled && (required || required === undefined) && status === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder + " Required"}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default LabeledSelect_CollectionArea;
