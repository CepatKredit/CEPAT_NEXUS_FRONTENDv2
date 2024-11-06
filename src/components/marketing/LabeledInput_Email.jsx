import React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';
 
function LabeledInput({rendered, required, label, placeHolder, value, receive, disabled,triggerValidation, readOnly, category, className_dmain, className_label, className_dsub }) {
    const [inputValue, setInputValue] = React.useState(value || '');
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const debouncedReceive = React.useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);

    React.useEffect(() => {
        if(rendered || triggerValidation){
            setIcon(false)
            if (value && value.match(isValidEmail)) {
                setStatus(''); 
                setIcon(true); 
            } else {
                setStatus('error'); 
                setIcon(true); 
            }
        }
    }, [triggerValidation]);

    function onChange(e) {
        let newValue = e.target.value;
 
       
            setInputValue(newValue); 
        if (newValue && newValue.match(isValidEmail)) {
            setStatus(''); 
            setIcon(true); 
            debouncedReceive(newValue)
        } else {
            setStatus('error'); 
            setIcon(true); 
            debouncedReceive();
        }
    }
 
    function onBlur() {
        
        setIcon(true);
        if (!inputValue || !inputValue.match(isValidEmail)) {
            setStatus('error'); 
        }
    }
 
    
 
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
                
                        <Input
                        className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    readOnly={readOnly}
                    value={inputValue}
                    onChange={(e) => { onChange(e) }}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    onBlur={(e) => { onBlur(e) }}
                    status={!readOnly && (required || required == undefined) ? getStatus : false}
                    suffix={
                        !readOnly && (required || required == undefined) ?(
                        <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                            {getStatus === 'error'
                                ? <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                : <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            }
                        </span>) : (<></>)
                    }
                />
                {!readOnly && (required || required == undefined) ?(
                    getStatus === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder !== 'FB Profile' ? `${placeHolder} Required` : `${placeHolder} Required (e.g. http://www.facebook.com/jdelacruz)`}
                    </div>
                    ) : null) : null
            }
                   
            </div>
        </div>
    )
}


 
export default LabeledInput;