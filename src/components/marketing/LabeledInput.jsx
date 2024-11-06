import React from 'react'
import { Input } from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput({ rendered, required, label, placeHolder, value, receive, category, triggerValidation, readOnly, type, disabled, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState('');
    const [getIcon, setIcon] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || '');

    // Debounce the value change to avoid updating state on every keystroke
    const debreceive = React.useCallback(debounce((newValue) => {
        receive(newValue);
    }, 300), [receive]);

    function onChange(e) {
        let newValue = e.target.value;
        setInputValue(newValue);
        setIcon(false);

        if (newValue) {
            setStatus('');
            setIcon(true);
            debreceive(newValue);
        } else {
            setStatus('error');
            setIcon(true);
            debreceive();
        }
    }

    function onBlur() {
        setIcon(true);
        if (!inputValue) {
            setStatus('error');
        } else {
            setStatus('');
        }
    }

    React.useEffect(() => {
        if (rendered || triggerValidation) {
            setIcon(false)
            onBlur()
        }
    }, [triggerValidation]);

    return (
        <div className={className_dmain}>
            <div>
                <label className={className_label}>{label}</label>
            </div>

            <div className={className_dsub}>
                <Input
                    disabled={disabled}
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    readOnly={readOnly}
                    value={inputValue}
                    onChange={(e) => { onChange(e) }}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    onBlur={(e) => { onBlur(e) }}
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
                            {placeHolder !== 'FB Profile' ? `${placeHolder} Required` : `${placeHolder} Required (e.g. http://www.facebook.com/jdelacruz)`}
                        </div>
                    ) : null) : null
                }
            </div>
        </div>
    )
}

export default LabeledInput;
