import React from 'react';
import { Input } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';

function LabeledInput_Numeric({
  rendered,
  label,
  placeHolder,
  value,
  receive,
  required,
  readOnly,
  digits,
  disabled,
  className_dmain,
  className_label,
  className_dsub,
}) {
  const [getStatus, setStatus] = React.useState('');
  const [getIcon, setIconType] = React.useState(false);
  const [getItem, setItem] = React.useState(value || '0'); // Default to '0' if no value is provided

  const debReceive = React.useCallback(
    debounce((newValue) => {
      receive(newValue);
    }, 300),
    [receive]
  );

  function onChangeValue(e) {
    const inputValue = e.target.value;
    // Allow only numeric values within range and 0
    if (inputValue.length === 0 || (inputValue === '0' && label === 'Dependents')) {
      setItem('0');
      setStatus('');
      setIconType('success');
      debReceive('0');
    } else if (inputValue.length <= digits && /^[0-9]*$/.test(inputValue)) {
      setItem(inputValue);
      setStatus('');
      setIconType('success');
      debReceive(inputValue);
    } else {
      setStatus('error');
      setIconType('error');
      debReceive();
    }
  }

  function onBlur() {
    // Validate if the input is empty or invalid
    if (getItem === '' || isNaN(getItem) || parseInt(getItem, 10) < 0) {
      setStatus('error');
      setIconType('error');
    } else {
      setStatus('');
      setIconType('success');
    }
  }

  React.useEffect(() => {
    if (rendered) {
      setIconType(false);
      onBlur();
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
          value={getItem}
          onChange={onChangeValue}
          size="large"
          placeholder={placeHolder}
          autoComplete="off"
          style={{ width: '100%' }}
          status={!readOnly && (required || required === undefined) ? getStatus : false}
          suffix={
            !readOnly && (required || required === undefined) ? (
              <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                {getStatus === 'error' ? (
                  <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                ) : (
                  <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                )}
              </span>
            ) : (
              <></>
            )
          }
        />
        {!readOnly && (required || required === undefined) ? (
          getStatus === 'error' ? (
            <div className="text-xs text-red-500 pt-1 pl-2">
              {placeHolder === 'No. of Dependents' ? `${placeHolder} Required (0 to 99)` : `${placeHolder} Required`}
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
}

export default LabeledInput_Numeric;
