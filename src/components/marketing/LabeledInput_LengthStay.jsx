import * as React from 'react';
import { Input, Space } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput_LengthStay({
    rendered,
    label,
    value_year,
    value_month,
    receiveM,
    receiveY,
    category,
    triggerValidation,
    readOnly,
    placeHolder,
    disabled,
    className_dmain,
    className_label,
    className_dsub,
}) {
    const [getStatus, setStatus] = React.useState([1, 1]);
    const [getIconType, setIconType] = React.useState(false);
    const [getValueM, setValueM] = React.useState(value_month ? value_month.toString() : '0');
    const [getValueY, setValueY] = React.useState(value_year ? value_year.toString() : '0');

    const debReceiveY = React.useCallback(
        debounce((newValue) => {
            receiveY(newValue);
        }, 300),
        [receiveY]
    );

    const debReceiveM = React.useCallback(
        debounce((newValue) => {
            receiveM(newValue);
        }, 300),
        [receiveM]
    );

    React.useEffect(() => {
        if (rendered || triggerValidation) {
            setIconType(true);
            const months = parseInt(getValueM) || 0;
            const years = parseInt(getValueY) || 0;

            if (months === 0 && years === 0) {
                setStatus([0, 0]); // Both fields are 0, show error
            } else if (months > 11 || years < 0) {
                setStatus([months <= 11 ? 1 : 0, years >= 0 ? 1 : 0]); // Validate each field separately
            } else {
                setStatus([1, 1]); // Both fields are valid
            }
        }
    }, [triggerValidation, getValueM, getValueY]);

    function onChangeValueMos(e) {
        const inputValue = e.target.value;
        if (inputValue === '') {
            setValueM('0'); // Display 0 if the input is empty
            debReceiveM(0);
            setStatus((prevStatus) => [0, prevStatus[1]]);
        } else if (!/^\d{3}$/.test(inputValue) && /^[0-9]*$/.test(inputValue)) {
            const parsedValue = parseInt(inputValue) || 0;
            setValueM(parsedValue.toString());
            setIconType(true);
            if (parsedValue >= 0 && parsedValue <= 11) {
                setStatus((prevStatus) => [1, prevStatus[1]]);
                debReceiveM(parsedValue);
            } else {
                setStatus((prevStatus) => [0, prevStatus[1]]);
                debReceiveM();
            }
        }
    }

    function onChangeValueYrs(e) {
        const inputValue = e.target.value;
        if (inputValue === '' || getValueM === '') {
            setValueY(inputValue);
            debReceiveY();
            setStatus((prevStatus) => [prevStatus[0], 0]);
        } else if (!/^\d{3}$/.test(inputValue) && /^[0-9]*$/.test(inputValue)) {
            const parsedValue = parseInt(inputValue) || 0;
            setValueY(parsedValue.toString());
            setIconType(true);
            if (parsedValue === 0 && parseInt(getValueM) === 0) {
                setStatus((prevStatus) => [prevStatus[0], 0]);
                debReceiveY();
            } else {
                setStatus((prevStatus) => [prevStatus[0], 1]);
                debReceiveY(parsedValue);
            }
        }
    }

    return (
        <div className={className_dmain}>
            {category === 'marketing' ? (
                <div>
                    <label className={className_label}>{label}</label>
                </div>
            ) : category === 'direct' ? (
                <label className={className_label}>{label}</label>
            ) : null}
            <Space.Compact>
                <div>
                    <Input
                        onChange={(e) => onChangeValueYrs(e)}
                        addonBefore={'Years'}
                        size="large"
                        disabled={disabled}
                        value={getValueY}
                        maxLength={2}
                        status={getStatus[0] === 1 && getStatus[1] === 1 ? '' : 'error'}
                    />
                </div>
                <div>
                    <Input
                        addonBefore={'Months'}
                        size="large"
                        disabled={disabled}
                        value={getValueM}
                        maxLength={2}
                        status={getStatus[0] === 1 && getStatus[1] === 1 ? '' : 'error'}
                        onChange={(e) => onChangeValueMos(e)}
                        suffix={
                            <span style={{ visibility: getIconType ? 'visible' : 'hidden' }}>
                                {getStatus[0] !== 1 || getStatus[1] !== 1 ? (
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
                <div className="text-xs text-red-500 pt-1 pl-2">Length of Stay Required</div>
            )}
        </div>
    );
}

export default LabeledInput_LengthStay;
