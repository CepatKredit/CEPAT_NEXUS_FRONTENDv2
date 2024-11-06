import React from 'react';
import { Input} from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput_Numeric({rendered, label, placeHolder, value, receive, required, readOnly, digits, disabled, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIconType] = React.useState(false);
    const [getItem, setItem] = React.useState(value || '');

    const debReceive = React.useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);

    function onChangeValue(e) {
        const inputValue = e.target.value;
        if (inputValue.length == 0 || (label=='Contract Duration' && inputValue=='0')) {
            setItem(inputValue);
            setStatus('error');
            setIconType('error');
            debReceive();
        }else if (inputValue.length !== digits + 1 && /^[0-9]*$/.test(inputValue)) {
            setItem(inputValue);
            setStatus('');
            setIconType('success');
            debReceive(inputValue);
        } else if (inputValue.length == digits + 1) {
            setStatus('');
            setIconType('success');
        } else {
            setStatus('error');
            setIconType('error');
            debReceive();
        }
    }
    function onBlur() {
        if (!getItem || isNaN(getItem) ) {
            setStatus('error');
            setIconType('error');
        } else {
            setStatus('');
            setIconType('success');
        }
    }

    React.useEffect(() => {
        if(rendered){
            setIconType(false)
            onBlur()
        }
    }, []);

    return (
        <div className={className_dmain}>
        <div>
                <label className={className_label}>{label}</label>
            </div>
        <div className={className_dsub}>
               
                <Input
                    disabled={disabled}
                    readOnly={readOnly}
                    value={getItem || undefined}
                    onChange={onChangeValue}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    //onBlur={onBlur}
                    status={!readOnly && (required || required === undefined) ? getStatus : false}
                    suffix={
                        !readOnly && (required || required === undefined) ? (
                        <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                            {getStatus === 'error'
                                ? <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                : <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            }
                        </span>) : (<></>)
                    }
                />
                {!readOnly && (required || required === undefined) ? (
                    getStatus === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder === 'No. of Dependents' ?  `${placeHolder} Required (Anything Between 0 and 99)` :
                        placeHolder === 'No. of Months'? `Contract Duration Required (${placeHolder})` :`${placeHolder} Required`}
                        </div>
                    ) : null) : null
                }
            </div>
        </div>
    )
}

export default LabeledInput_Numeric