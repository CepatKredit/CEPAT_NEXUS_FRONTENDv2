import * as React from 'react'
import { Input, Space } from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput_LengthStay({ rendered, label, value_year, value_month, receiveM, receiveY, category, triggerValidation, readOnly, placeHolder, disabled, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState([1, 1]);
    const [getIconType, setIconType] = React.useState(false);
    const [getValueM, setValueM] = React.useState(value_month? value_month.toString() : '0')
    const [getValueY, setValueY] = React.useState(value_year? value_year.toString() : '0')

    const debReceiveY = React.useCallback(debounce((newValue) => {
        receiveY(newValue);
    }, 300), [receiveY]);
    const debReceiveM = React.useCallback(debounce((newValue) => {
        receiveM(newValue);
    }, 300), [receiveM]);
    
    React.useEffect(() => {
        if (rendered || triggerValidation) {
            setIconType(true);
            if(parseInt(getValueM) === 0 && parseInt(getValueY) === 0){
                setStatus([0,0]);
            }else if (!getValueM || parseInt(getValueM) > 11 || !getValueY) {
                setStatus([getValueM && parseInt(getValueM) <= 11 ? 1 : 0, getValueY ? 1 : 0]);
            } else {
                setStatus([1, 1]);
            }
        }
    }, [triggerValidation]);

    function onChangeValueMos(e) {
        const inputValue = e.target.value;
        if (!(/^\d{3}$/.test(inputValue)) && /^[0-9]*$/.test(inputValue)) {
            setValueM(inputValue)
            if ((parseInt(inputValue) >= 1 && parseInt(inputValue) <= 11) || (parseInt(inputValue) === 0 && parseInt(getValueY) >= 1)) {
                if(getStatus[0]===0 && getStatus[1] ===0){
                    setStatus(prevStatus => [prevStatus[0], 1]);
                }
                setStatus(prevStatus => [1, prevStatus[1]]);
                setIconType(true);
                debReceiveM(parseInt(inputValue));
            } else {
                setStatus(prevStatus => [0, prevStatus[1]]);
                setIconType(true);
                debReceiveM();
            }
        }
    }

    function onChangeValueYrs(e) {
        const inputValue = e.target.value;
        if (!(/^\d{3}$/.test(inputValue)) && /^[0-9]*$/.test(inputValue)) {
            setValueY(inputValue)
            if (inputValue.length === 0 || (parseInt(inputValue) === 0 && parseInt(getValueM) === 0)) {
                setStatus(prevStatus => [prevStatus[0], 0]);
                setIconType(true);
                debReceiveY();
            } else {
                if(getStatus[0]===0 && getStatus[1] ===0){
                    setStatus(prevStatus => [1, prevStatus[1]]);
                }
                setStatus(prevStatus => [prevStatus[0], 1]);
                setIconType(true);
                debReceiveY(parseInt(inputValue));
            }
        }
    }

    return (
        <div className={className_dmain}>
            {category === 'marketing' ? (
                <div>
                    <label className={className_label}>{label}</label>
                </div>
            ) : category === "direct" ? (
                <label className={className_label}>{label}</label>
            ) : null}
            <Space.Compact>
                <div>
                <Input
                        onChange={(e) => onChangeValueYrs(e)}
                        addonBefore={'Years'}
                        size='large'
                        disabled={disabled}
                        value={getValueY}
                        maxLength={2}
                        status={(getStatus[0] === 1 && getStatus[1] === 1) ? '' : 'error'}
                        
                    />
                </div>
                <div>
                <Input
                        addonBefore={'Months'}
                        size='large'
                        disabled={disabled}
                        value={getValueM}
                        maxLength={2}
                        status={(getStatus[0] === 1 && getStatus[1] === 1) ? '' : 'error'}
                        onChange={(e) => onChangeValueMos(e)}
                        suffix={
                            <span style={{ visibility: getIconType ? 'visible' : 'hidden' }}>
                                {(getStatus[0] !== 1 || getStatus[1] !== 1) ? (
                                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                ) : (
                                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                )}
                            </span>
                        }
                    />
                </div>
            </Space.Compact>
            {(getStatus[0] === 0 || getStatus[1] === 0) && (
                <div className='text-xs text-red-500 pt-1 pl-2'>
                    {`${placeHolder} Required`}
                </div>
            )}
        </div>
    )
}

export default LabeledInput_LengthStay