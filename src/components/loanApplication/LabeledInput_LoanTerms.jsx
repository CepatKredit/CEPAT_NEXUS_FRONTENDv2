import * as React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

function LabeledInput_LoanTerms({
    label,
    value,
    receive,
    placeHolder,
    category,
    className_dmain,
    className_label,
    className_dsub,
    disabled,
    readOnly,
    terms
}) {
    const [getStatus, setStatus] = React.useState('');
    const [getIconType, setIconType] = React.useState(false); 
    const [getItem, setItem] = React.useState(value || '');

    function onChangeValue(e) {
        const inputValue = e.target.value;
        if (!(/^\d{3}$/.test(inputValue)) && /^[0-9]*$/.test(inputValue)) {
            setItem(inputValue);
            if (parseInt(inputValue) >= 3 && parseInt(inputValue) <= terms) {
                setStatus('');
                setIconType('success');
                receive(inputValue);
            } else {
                setStatus('error');
                setIconType('error');
                receive();
            }
        }
    }

    function onBlur() {
        if (!getItem || isNaN(getItem) || parseInt(getItem) < 3 || parseInt(getItem) > terms) {
            setStatus('error');
            setIconType('error');
        } else {
            setStatus('');
            setIconType('success');
        }
    }

    // Suffix icon rendering logic
    const suffixIcon = getIconType === 'error' ? (
        <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
    ) : getIconType === 'success' ? (
        <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
    ) : null;

    return (
        <div className={className_dmain}>
            {category === 'marketing' ? (
                <div>
                    <label className={className_label}>{label}</label>
                </div>
            ) : category === 'direct' ? (
                <label className={className_label}>{label}</label>
            ) : null}

            <div className={className_dsub}>
                <Input
                    disabled={disabled}
                    readOnly={readOnly}
                    value={getItem}
                    onChange={onChangeValue}
                    size='large'
                    placeholder={placeHolder}
                    autoComplete='off'
                    style={{ width: '100%' }}
                    onBlur={onBlur}
                    status={getStatus}
                    suffix={
                        <span style={{ visibility: getIconType ? 'visible' : 'hidden' }}>
                            {getStatus === 'error'
                                ? <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                : <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                            }
                        </span>
                    }                />
                {getStatus === 'error' ? (
                    <div className='text-xs text-red-500 pt-1 pl-2'>
                        {placeHolder + " Required"}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default LabeledInput_LoanTerms;
