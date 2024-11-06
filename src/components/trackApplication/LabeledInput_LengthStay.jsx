import * as React from 'react'
import { Input, Space } from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
 
function LabeledInput_LengthStay({ label, value_year, value_month, receiveM, receiveY , category, readOnly, type, disabled, className_dmain, className_label, className_dsub }) {
    const [getStatus, setStatus] = React.useState([1,1]);
    const [getIconType, setIconType] = React.useState(false);
    const [getValueM, setValueM] = React.useState(value_month || '')
    const [getValueY, setValueY] = React.useState(value_year || '')
 
 
    function onChangeValueMos(e) {
 
        const inputValue = e.target.value;
        if (!(/^\d{3}$/.test(inputValue)) && /^[0-9]*$/.test(inputValue) ) {
            setValueM(inputValue)
            if (parseInt(inputValue) <= 11) {
                setStatus(prevStatus => [1, prevStatus[1]]);
                setIconType(true);
                receiveM(inputValue);
            } else {
                setStatus(prevStatus => [0, prevStatus[1]]);
                setIconType(true);
                receiveM();
            }
        }
           
    }
    function onChangeValueYrs(e) {
        const inputValue = e.target.value;
        if(inputValue.length == 0){
            setValueY(inputValue)
            setStatus(prevStatus => [prevStatus[0], 0]);
            receiveY();
        }
        if(!(/^\d{3}$/.test(inputValue)) && /^[0-9]*$/.test(inputValue)){
            setValueY(inputValue)
            setStatus(prevStatus => [prevStatus[0], 1]);
            setIconType(true);
            receiveY(inputValue);
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
                        addonBefore={'Months'}
                        size='large'
                        disabled={disabled}
                        value={getValueM}
                        maxLength={2}
                        status={(getStatus[0] === 1 && getStatus[1] === 1)?'':'error'}
                        onChange={(e)=>onChangeValueMos(e)}
                    />
                </div>
                <div>
                    <Input
                        onChange={(e)=>onChangeValueYrs(e)}
                        addonBefore={'Years'}
                        size='large'
                        disabled={disabled}
                        value={getValueY}
                        maxLength={2}
                        status={(getStatus[0] === 1 && getStatus[1] === 1)?'':'error'}
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
                    {"Required"}
                </div>
            )}
        </div>
    )
}
 
export default LabeledInput_LengthStay