import * as React from 'react';
import { Input, Select } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { debounce } from '@utils/Debounce';
import { GET_LIST } from "@api/base-api/BaseApi";
import { useQuery } from '@tanstack/react-query';

function LabeledInput_ForeignCurrency({
  receiveFCurValue,
  data,
  receiveForeign,
  receiveConvert,
  rendered,
  required,
  label,
  placeHolder,
  value,
  receive,
  category,
  readOnly,
  type,
  disabled,
  className_dmain,
  className_label,
  className_dsub
}) {
  const [getStatus, setStatus] = React.useState('');
  const [getIcon, setIcon] = React.useState(false);
  const [getPref, setPref] = React.useState(data.FCurrency || '');
  const [getItem, setItem] = React.useState(removeCommas(data.FSalary ? data.FSalary.toString() : '0') || '');
  const [convertValue, setConvertValue] = React.useState(removeCommas(data.FCurValue ? data.FCurValue.toString() : '0') || 0);

  const dReceive = React.useCallback(debounce((newValue) => {
    receive(newValue);
  }, 300), [receive]);
  const dReceiveFCurVal = React.useCallback(debounce((newValue) => {
    receiveFCurValue(newValue);
  }, 300), [receive]);
  const dReceiveForeign = React.useCallback(debounce((newValue) => {
    receiveForeign(newValue);
  }, 300), [receive]);
  const dReceiveConvert = React.useCallback(debounce((newValue) => {
    receiveConvert(newValue);
  }, 300), [receive]);

  const getCurrencyList = useQuery({
    queryKey: ['getCurrencyList'],
    queryFn: async () => {
      const result = await GET_LIST('/GET/G105CL');
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0
        ? 500 : false
    },
    enabled: true,
    retryDelay: 1000,
  });


  //comma and decimal
  function formatNumberWithCommas(num) {
    if (!num) return '';
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
    return parts.join('.');
  }

  function removeCommas(num) {
    return num.replace(/,/g, '');
  }

  function formatToTwoDecimalPlaces(num) {
    if (!num) return '';
    return parseFloat(num).toFixed(2);
  }

  function onPrefChange(value, option) {
    if (!option || !option.exchangeRate) return;
    setPref(value);
    setConvertValue(option.exchangeRate);
    dReceiveFCurVal(option.exchangeRate)
    dReceive(value);
  }

  function onChange(e) {
    let num = e.target.value.replace(/[^0-9.]/g, '');
    const periodCount = num.split('.').length - 1;
    if (periodCount > 1) {
      num = num.slice(0, -1);
    } else if (periodCount === 1) {
      const parts = num.split('.');
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
      }
      num = parts.join('.');
    }

    const plainNum = removeCommas(num);
    const newValue = formatNumberWithCommas(plainNum);

    setItem(newValue);
    setIcon(true);
    if (newValue.length === 0) {
      setStatus('error');
      dReceiveForeign();
      dReceiveConvert('0.00');
    } else {
      setStatus('');
      dReceiveForeign(newValue);
    }
  }

  React.useEffect(() => {
    if (rendered) {
      if (getPref && parseFloat(getItem) > 0) {
        const plainItem = removeCommas(getItem);
        //setItem(formatNumberWithCommas(formatToTwoDecimalPlaces(plainItem)));
        setStatus('');
        setIcon(true);
      } else {
        setStatus('error');
        setIcon(true);
      }

    }

    if (getPref && getItem) {
      const plainItem = removeCommas(getItem);
      let converted = convertValue * parseFloat(plainItem || 0.0);
      dReceiveConvert(formatNumberWithCommas(formatToTwoDecimalPlaces(converted)));
      onPrefChange(getPref, getCurrencyList.data?.find((cur) => cur.currencyCode === getPref));
    } else if (getItem === '') {
      dReceiveConvert('0.00');
    }
  }, [rendered, getPref, getItem, convertValue, getCurrencyList.data]);

  function onBlur() {
    setItem(formatNumberWithCommas(formatToTwoDecimalPlaces(removeCommas(getItem))))
  }

  const prefix = (
    <Select
      options={getCurrencyList.data?.map(x => ({
        value: x.currencyCode,
        label: `${x.currencyCode} - ${x.currencyName}`,
        exchangeRate: x.exchangeRate,
      }))}
      value={getPref || undefined}
      onChange={(value, option) => onPrefChange(value, option)}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.label && option.label.toLowerCase().includes(input.toLowerCase())
      }
      showSearch
      style={{ width: '140px' }}
      dropdownStyle={{ width: '250px' }} // Adjusts the dropdown width
      placeholder={'Currency Type'}
    />
  );

  return (
    <>
      <div className={className_dmain}>
        {category === 'marketing' ? (
          <div>
            <label className={className_label}>{label}</label>
          </div>
        ) : category === "direct" ? (
          <label className={className_label}>{label}</label>
        ) : null}

        <div className={className_dsub}>
          <Input
            addonBefore={prefix}
            disabled={disabled}
            readOnly={readOnly}
            value={getItem}
            onChange={onChange}
            size='large'
            onBlur={onBlur}
            placeholder={placeHolder}
            maxLength={14}
            autoComplete='off'
            style={{ width: '100%' }}
            status={required || required === undefined ? getStatus : false}
            suffix={
              required || required === undefined ? (
                <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                  {getStatus === 'error' ? (
                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                  ) : (
                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                  )}
                </span>
              ) : (<></>)
            }
          />
          {required || required === undefined ? (
            getStatus === 'error' ? (
              <div className='text-xs text-red-500 pt-1 pl-2'>
                {placeHolder !== 'FB Profile' ? `${placeHolder} Required` : `${placeHolder} Required (e.g. http://www.facebook.com/jdelacruz)`}
              </div>
            ) : null
          ) : null}
        </div>
      </div>
      <div className={className_dmain}>
        {category === 'marketing' ? (
          <div>
            <label className={className_label}>{'Salary in Peso Currency'}</label>
          </div>
        ) : null}

        <div className={className_dsub}>
          <Input
            readOnly
            value={data.PSalary || 0.00}
            size='large'
            style={{ width: '100%' }}
            status={required || required === undefined ? getStatus : false}
            suffix={
              required || required === undefined ? (
                <span style={{ visibility: getIcon ? 'visible' : 'hidden' }}>
                  {getStatus === 'error' ? (
                    <ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />
                  ) : (
                    <CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />
                  )}
                </span>
              ) : (<></>)
            }
          />
        </div>
      </div>
    </>
  );
}

export default LabeledInput_ForeignCurrency;