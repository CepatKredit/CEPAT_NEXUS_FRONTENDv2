import { Input } from 'antd'
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { InputComponentHook } from '@hooks/ComponentHooks';

function InputOpt({
    rendered,
    required = true,
    label,
    placeHolder,
    value,
    receive,
    readOnly = false,
    disabled = false,
    className_dmain = '',
    className_label = '',
    className_dsub = '',
    KeyName,
    compname,
    format = '',
    group,
}) {

    const { inputValue, status, iconVisible, handleChange, handleBlur, errorMessage } = InputComponentHook(value, receive, rendered, KeyName, compname, format, group, disabled);

    const isValidationEnabled = !readOnly && required;

    return (
        <div className={className_dmain}>
            {label && <label className={className_label}>{label}</label>}

            <div className={className_dsub}>
                <Input
                    disabled={disabled}
                    className={`w-full ${readOnly ? 'bg-[#f5f5f5]' : 'bg-[#ffffff]'}`}
                    readOnly={readOnly}
                    value={inputValue}
                    onChange={(e) => { handleChange(e.target.value, true) }}
                    size="large"
                    placeholder={placeHolder}
                    autoComplete="off"
                    style={{ width: '100%' }}
                    maxLength={100} //Initial
                    onBlur={handleBlur}
                    status={isValidationEnabled ? status : undefined}
                    suffix={
                        isValidationEnabled && (
                            <span style={{ visibility: iconVisible ? 'visible' : 'hidden' }}>
                                {status === 'error' ? (
                                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                                ) : (
                                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                                )}
                            </span>
                        )
                    }
                />
                {isValidationEnabled && status === 'error' && (
                    <div className="text-xs text-red-500 pt-1 pl-2">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InputOpt;
