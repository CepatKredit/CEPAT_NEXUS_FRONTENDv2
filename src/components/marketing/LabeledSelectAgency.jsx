import * as React from 'react';
import { Select, ConfigProvider, Input, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledSelectAgency({rendered, showSearch, required, placeHolder, label, value, receive, disabled, readOnly, className_dmain, className_label, className_dsub }) {
    const [status, setStatus] = React.useState('');
    const [icon, setIcon] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || '');

    const { data: getAgencyOption } = useQuery({
        queryKey: ['getAgency'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/GetAgency');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });

    React.useEffect(()=>{
        setSelectedValue(value)
    },[value])

    function GetDecsAgency() {
        if (!getAgencyOption) return undefined;
    
        return getAgencyOption.find((x) => {
            return x.name === selectedValue || x.id === selectedValue;
        });
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
        if (!selectedValue || !value) {
            setStatus('error');
        } else {
            setStatus('');
        }
    }
    React.useEffect(() => {
        if(rendered){
            onBlur()
        }
    }, [value,rendered]);


    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>
            <div className={className_dsub}>
                {disabled
                    ? (
                        <Input
                            readOnly={disabled}
                            className={`w-full ${
                                disabled 
                                    ? selectedValue 
                                        ? (getAgencyOption && getAgencyOption.find(x => x.id === selectedValue)?.agencyStatus === 1 ? 'bg-[#ff0000] hover:bg-[#ff6666]' :
                                          getAgencyOption && getAgencyOption.find(x => x.id === selectedValue)?.agencyStatus === 2 ? 'bg-[#ffa500] hover:bg-[#ffcc66]' :
                                          getAgencyOption && getAgencyOption.find(x => x.id === selectedValue)?.agencyStatus === 0 ? 'bg-[#f5f5f5] hover:bg-[#e0e0e0] text-black' : 'bg-[#ffffff] hover:bg-[#f0f0f0]') 
                                        : 'bg-[#f5f5f5] hover:bg-[#e0e0e0]'  
                                    : 'bg-[#ffffff] hover:bg-[#f0f0f0]'
                            } ${getAgencyOption && getAgencyOption.find(x => x.id === selectedValue)?.agencyStatus === 0 ? 'text-black' : 'text-white'}`}
                            value={GetDecsAgency() ? GetDecsAgency().name : ''}
                            size="large"
                            placeholder={placeHolder}
                            autoComplete="off"
                            style={{ width: '100%' }}
                        />
                    ) : (
                        <ConfigProvider theme={{
                            components: {
                                Select: {
                                    colorBgContainer: selectedValue && getAgencyOption 
                                        ? (getAgencyOption.find(x => x.id === selectedValue)?.agencyStatus === 1 ? '#ff0000' :
                                          getAgencyOption.find(x => x.id === selectedValue)?.agencyStatus === 2 ? '#ffa500' :
                                          '#ffffff') 
                                        : '#ffffff',
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
          backgroundColor: x.agencyStatus === 1 ? 'red' : 
                           x.agencyStatus === 0 ? 'white' : 
                           x.agencyStatus === 2 ? 'orange' : 'white',
          color: x.agencyStatus === 0 ? 'black' : 'white'
        }}
      >
        <div
         className={`${
            x.agencyStatus === 1 ? 'bg-[#ff0000]' :
            x.agencyStatus === 2 ? 'bg-[#ffa500]':
            x.agencyStatus === 0 ? 'bg-white' : 'bg-white'
          } ${
            x.agencyStatus === 0 ? 'text-black' : 'text-white'
          } py-1 px-2 rounded-md h-7 text-sm`}
>
          {x.name}
        </div>
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
