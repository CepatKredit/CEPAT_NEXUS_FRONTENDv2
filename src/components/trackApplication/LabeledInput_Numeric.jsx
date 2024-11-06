import * as React from 'react'
import { Input} from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledInput_Numeric({ label, required, placeHolder, value, receive, category, readOnly, digits, disabled, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('');
    const [getIconType, setIconType] = React.useState(false);
    const [getItem, setItem] = React.useState(value);
    function onChangeValue(e) {
        const inputValue = e.target.value;

        if (inputValue.length == 0) {
            setItem(inputValue);
            setStatus('error');
            setIconType('error');
            receive();
        }else if (inputValue.length !== digits + 1 && /^[0-9]*$/.test(inputValue)) {
            setItem(inputValue);
            setStatus('');
            setIconType('success');
            receive(inputValue);
        } else if (inputValue.length == digits + 1) {
            setStatus('');
            setIconType('success');
        } else {
            setStatus('error');
            setIconType('error');
            receive();
        }
    }
    function onBlur() {
        if (!getItem || isNaN(getItem)) {
            setStatus('error');
            setIconType('error');
        } else {
            setStatus('');
            setIconType('success');
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
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]':'bg-[#ffffff]'}`}
                    disabled={disabled}
                    readOnly={readOnly}
                    value={getItem}
                    onChange={onChangeValue}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    onBlur={onBlur}
                    status={!readOnly && (required || required === undefined) ? getStatus : false}
                    suffix={
                        !readOnly && (required || required === undefined) ? (
                        <span style={{ visibility: getIconType ? 'visible' : 'hidden' }}>
                            {getStatus === 'error'
                                ? <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                : <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            }
                        </span>) : (<></>)
    } />
                {!readOnly && (required || required === undefined) ? (getStatus === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder !== 'No. of Dependents' ? `${placeHolder} Required` : `${placeHolder} Required (Anything Between 0 and 99)`}
                    </div>
                ) : null) : null}
                    
            </div>
        </div>
    )
}

export default LabeledInput_Numeric