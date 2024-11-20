import * as React from 'react';
import { Input } from 'antd';
import { toUpperText } from '@utils/Converter';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput_AddressStreet({ rendered,data, type, required, label, placeHolder, value, receive, disabled, readOnly, className_label, className }) {
    //let inputValue = value || '';
    const [input,setinput] = React.useState(value || '')
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);

    // Debounce the value change to avoid updating state on every keystroke
    const debouncedReceive = React.useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);

    React.useEffect(()=>{
        setinput(value)
    },[value])

    function onChange(e) {
        let newValue = e.target.value;
        const letterAndSpaceValue = newValue.slice(0, 250);
        setIcon(false);
        const upperValue = toUpperText(letterAndSpaceValue);
        //inputValue = upperValue; // Set uppercase input
        setinput(upperValue)
        // Real-time validation
        if (letterAndSpaceValue) {
            setStatus(''); // Set checkmark icon when input is valid
            setIcon(true); // Automatically close tooltip when input is valid
            debouncedReceive(upperValue);
        } else {
            setStatus('error'); // Set error status when input is empty
            setIcon(true); // Keep tooltip visible when input is empty
            debouncedReceive();
        }
    }
    //Fix here
    React.useEffect(() => {
        if (rendered) {
            setIcon(false)
            if (!value) {
                setStatus('error'); 
                setIcon(true); 
            } else {
                setStatus(''); 
                setIcon(true); 
            }
        }
    }, [value,rendered]);

    return (
        <div className={className}>
            <div>
                <label className={className_label}>{label}</label>
            </div>
            <div>
                <Input
                    style={{
                        resize: 'none',
                    }}
                    size="large"
                    value={input}
                    autoComplete='new-password'
                    placeholder={placeHolder}
                    onChange={(e) => { onChange(e) }}
                    disabled={disabled}
                    readOnly={readOnly}
                    status={required || required === undefined ? getStatus : false}
                    maxLength={250}
                    suffix={
                        required || required === undefined ? (
                            getIcon === true ? (
                                getStatus === 'error' ? (
                                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                ) : (
                                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                )
                            ) : (
                                <></>
                            )
                        ) : (
                            <></>
                        )
                    }
                />
                {required || required === undefined ? (
                    getStatus === 'error' ? (
                        <div className="text-xs text-red-500 pt-1 pl-2">{placeHolder + ' Required'}</div>
                    ) : (
                        <></>
                    )
                ) : null}
            </div>
        </div>
    )
}

export default LabeledInput_AddressStreet