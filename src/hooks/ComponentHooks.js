import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { mmddyy } from '@utils/Converter';
import { DateFormat } from '@utils/Formatting';
import { dateMessage } from '@utils/MessageValidationList';
import { checkAgeisValid, CheckDateValid, checkDeployisValid } from '@utils/Validations';
import dayjs from 'dayjs';
import { useState, useMemo, useCallback, useEffect, useRef, useContext } from 'react';


function hookValid(KeyName, date) {
  if (KeyName === 'ofwDeptDate' || KeyName === 'loanDateDep') { return !checkDeployisValid(date) }
  else if (KeyName === 'ofwbdate' || KeyName === 'ofwspousebdate' || KeyName === "benbdate" || KeyName === "coborrowerspousebdate" || KeyName === "coborrowbdate" || KeyName === "benspousebdate") { return !checkAgeisValid(date) }
  else { return CheckDateValid(date) }
}

export function SelectComponentHooks(search, receive, options, setSearchInput, KeyName, rendered, value,setRendered) {
  const { getAppDetails } = useContext(LoanApplicationContext)
  const [status, setStatus] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.label.toLowerCase().includes(search ? search.toLowerCase() : '')
    );
  }, [search, options]);

  useEffect(() => { //Should place to another file?
    setStatus("")
  }, [!getAppDetails.dataPrivacy])

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  const handleSelectChange = useCallback((selectedValue) => {
    setDropdownOpen(false)
    setRendered(true)
    setStatus(selectedValue ? '' : 'error');
    receive(selectedValue || undefined);
  }, [receive]);

  const handleKeyDown = useCallback((event) => {
    if (!filteredOptions.length) return;
    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => (prevIndex + 1) % filteredOptions.length);
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) =>
        prevIndex === 0 ? filteredOptions.length - 1 : prevIndex - 1
      );
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      handleSelectChange(filteredOptions[highlightedIndex].value);
      setSearchInput('')
    }
  }, [filteredOptions, highlightedIndex, handleSelectChange]);

  useEffect(() => {
    if (rendered) {
      if (!value) {
        setStatus("error")
      } else {
        setStatus("")
      }
    }
  }, []);

  return {
    status,
    highlightedIndex,
    filteredOptions,
    handleSelectChange,
    handleKeyDown,
    dropdownOpen,
    setDropdownOpen,
  };
}

export function DateComponentHook(value, rendered, receive, KeyName, notValidMsg, setRendered) {
  const { getAppDetails, updateAppDetails } = useContext(LoanApplicationContext)
  const [status, setStatus] = useState('');
  const [iconVisible, setIconVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value ? dayjs(value).format('MM-DD-YYYY') : '');
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(value ? dayjs(value, 'MM-DD-YYYY') : '');
  const [debouncedInput, setDebouncedInput] = useState(inputValue);
  const [validationMessage, setValidationMessage] = useState('');

  /* cant be used here or add new paramater to trigger this function
  useEffect(() => {
      setStatus("");
      setIconVisible(false)
      setInputValue('')
      setDebouncedInput('')
  }, [!getAppDetails.dataPrivacy])*/

  const debounceChange = useCallback((formattedValue) => {
    setDebouncedInput(formattedValue);
  }, []);

  const handleInputChange = (e, readOnly) => {
    if (readOnly) return;
    if (KeyName === 'ofwDeptDate' || KeyName === 'loanDateDep') {
      setDatePickerValue('');
    } else {
      setDatePickerValue(CheckDateValid(e.target.value) ? dayjs(e.target.value) : '');
    }
    const formattedValue = DateFormat(e.target.value);
    debounceChange(formattedValue);
    setInputValue(formattedValue);
  };

  const handleDateChange = (dateValue) => {
    if (CheckDateValid(dateValue)) {
      setDatePickerValue(dateValue);
      const formattedValue = dateValue.format('MM-DD-YYYY');
      setInputValue(formattedValue);
      debounceChange(formattedValue);
      setDatePickerOpen(false);
    }
  };

  const toggleDatePicker = () => setDatePickerOpen((prev) => !prev);

  useEffect(() => {
    const handler = setTimeout(() => {
      setRendered(true);
      const date = dayjs(debouncedInput, 'MM-DD-YYYY');
      if (debouncedInput.length === 10 && date.isValid()) {
        if (hookValid(KeyName, date)) {
          setStatus('error');
          setValidationMessage(dateMessage(KeyName, 'Invalid'));
          /*
          if (KeyName === 'ofwbdate' || KeyName === 'ofwspousebdate' || KeyName === "benbdate" || KeyName === "coborrowerspousebdate" || KeyName === "coborrowbdate" || KeyName === "benspousebdate") {
            setValidationMessage('Age should be 20 to 65 years old only.');
          }else if(KeyName === 'ContractDate'){
            setValidationMessage('Invalid Contract Date')
          }else {
            setValidationMessage('Invalid Departure Date.');
          }
          updateAppDetails({ name: KeyName, value: '' })
          */
        } else {
          setIconVisible(true);
          setValidationMessage('');
          setStatus('');
          receive(mmddyy(date))
        }
      } else if (debouncedInput.length === 0 && (rendered === false || rendered === undefined)) {
        setStatus('');
        receive()
      } else if (rendered === true && debouncedInput.length === 0) {
        setStatus('error');
        setValidationMessage(dateMessage(KeyName, 'Empty'));
      } else {
        setStatus('error');
        setValidationMessage(dateMessage(KeyName, 'Invalid'));
        receive()
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [debouncedInput]);

  useEffect(() => {
    if (rendered) {
      setIconVisible(true);
      if (CheckDateValid(value)) {//Reset the DatePicker value when there is no valid date in input date
        setDatePickerValue('');
      }
      if (hookValid(KeyName, value)) {
        setStatus('error');
      } else {
        setStatus('');
      }
    }
  }, []);


  const handleBlur = () => {
    if (debouncedInput.length === 10 && inputValue.isValid()) {
      if (hookValid(KeyName, date)) {
        setStatus('error');
        setValidationMessage(dateMessage(KeyName, 'Invalid'));
        receive()
      } else {
        setIconVisible(true);
        setValidationMessage('');
        setStatus('');
        receive( mmddyy(date) )
      }
    } else if (debouncedInput.length === 0) {
      setStatus('error');
      setValidationMessage(dateMessage(KeyName, 'Empty'));
      // receive();
    } else {
      setStatus('error');
      setValidationMessage(dateMessage(KeyName, 'Invalid'));
      // receive();
    }
  };

  return {
    status,
    iconVisible,
    inputValue,
    datePickerValue,
    isDatePickerOpen,
    handleInputChange,
    handleDateChange,
    toggleDatePicker,
    setDatePickerOpen,
    validationMessage,
    handleBlur,
  };
}

//Focus to Required/Invalid Field
export function FocusHook() {
  const inputRefs = useRef({});

  const setfocus = useCallback((KeyName, ref) => {
    inputRefs.current[KeyName] = ref;
  }, []);

  const focus = useCallback((KeyName) => {
    inputRefs.current[KeyName]?.focus();
  }, []);

  return { setfocus, focus };
}
