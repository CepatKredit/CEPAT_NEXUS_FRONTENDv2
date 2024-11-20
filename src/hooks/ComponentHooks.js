import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { mmddyy } from '@utils/Converter';
import { debouncef } from '@utils/Debounce';
import { DateFormat, FormatCurrency, inputFormat, Uppercase } from '@utils/Formatting';
import { dateMessage, inputMessage } from '@utils/MessageValidationList';
import { checkAgeisValid, CheckDateValid, checkDeployisValid, CheckEmailValid, CheckIncomeValid, CheckRentAmortValid } from '@utils/Validations';
import dayjs from 'dayjs';
import { useState, useMemo, useCallback, useEffect, useRef, useContext } from 'react';


function hookDateValid(KeyName, date) {
  if (KeyName === 'ofwDeptDate' || KeyName === 'loanDateDep' || KeyName === 'ContractDate') { return !checkDeployisValid(date); }
  else if (KeyName === 'ofwbdate' || KeyName === 'ofwspousebdate' || KeyName === "benbdate" || KeyName === "coborrowerspousebdate" || KeyName === "coborrowbdate" || KeyName === "benspousebdate") { return !checkAgeisValid(date) }
  else { return CheckDateValid(date) }
}

function hookInputValid(KeyName, input, comp_name, format) {
  //LETTERS
  if (KeyName === 'Email' && CheckEmailValid(input)) {//For Email
    return { valid: true, value: input, errmsg: '' }; //As-is
  } else if (KeyName === 'Uppercase' && input !== '') { //For letters / number
    return { valid: true, value: Uppercase(input), errmsg: '' }; //Change format to uppercase
  } else if (KeyName === 'Default' && input !== '') { //For No-case sensitive
    return { valid: true, value: input, errmsg: '' }; //As-is
  //CURRENCY
  } else if (KeyName === 'Income' && input !== '' && CheckIncomeValid(input)) { // 25,000.00
    return { valid: true, value: inputFormat(format, input), errmsg: '' };
  } else if ((KeyName === 'Rent_Amort' || KeyName === 'Allotment' )&& input !== '' && CheckRentAmortValid(input)) { // 100.00
    return { valid: true, value: inputFormat(format, input), errmsg: '' };
  //NUMBER
  
  } else { //error
    return { valid: false, value: inputFormat(format, input), errmsg: inputMessage(KeyName, inputFormat(format, input) === '' ? 'Empty' : 'Invalid', comp_name) };
  }
}

export function SelectComponentHooks(search, receive, options, setSearchInput, KeyName, rendered, value, setRendered) {
  const { getAppDetails } = useContext(LoanApplicationContext);
  const [status, setStatus] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setselected] = useState(value || '');

  const filteredOptions = useMemo(() => {
    if (KeyName === 'ofwcountry') {
      return options.filter(option =>
        option.name.toLowerCase().includes(search ? search.toLowerCase() : '')
      );
    } else {
      return options.filter(option =>
        option.label.toLowerCase().includes(search ? search.toLowerCase() : '')
      );
    }
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
    setselected(selectedValue)
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
    selected,
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

  /*
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
    if (KeyName === 'ofwDeptDate' || KeyName === 'loanDateDep' || KeyName === 'ContractDate') {
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
      const date = dayjs(debouncedInput, 'MM-DD-YYYY');
      if (debouncedInput.length === 10 && date.isValid()) {
        if (hookDateValid(KeyName, date)) {
          setRendered(true);
          setStatus('error');
          setValidationMessage(dateMessage(KeyName, 'Invalid'));

        } else {
          setRendered(true);
          setIconVisible(true);
          setValidationMessage('');
          setStatus('');
          receive(mmddyy(date))
        }
      } else if (debouncedInput.length === 0 && (rendered === false || rendered === undefined)) {
        setStatus('error');
        receive()
      } else if (rendered === true && debouncedInput.length === 0) {
        setRendered(true);
        setStatus('error');
        setValidationMessage(dateMessage(KeyName, 'Empty'));
      } else {
        setRendered(true);
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
      if (CheckDateValid(inputValue)) {//Reset the DatePicker value when there is no valid date in input date
        setDatePickerValue('');
      }
      if (hookDateValid(KeyName, inputValue)) {
        setStatus('error');
      } else {
        setStatus('');
      }
      setDatePickerValue(CheckDateValid(inputValue) ? dayjs(inputValue) : '');
    }
  }, []);


  const handleBlur = (dat) => {
    const date = dat.target.value;
    if (debouncedInput.length === 10 && CheckDateValid(date)) { //Inputvalue is not defined after initilized
      if (hookDateValid(KeyName, date)) {
        setStatus('error');
        setValidationMessage(dateMessage(KeyName, 'Invalid'));
        receive()
      } else {
        setIconVisible(true);
        setValidationMessage('');
        setStatus('');
        receive(mmddyy(date))
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

export function InputComponentHook(initialValue, receive, rendered, KeyName, comp_name, format) {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('');
  const [iconVisible, setIconVisible] = useState(false);
  const latestValueRef = useRef(initialValue);
  const delay_def = 1000;

  const debouncedReceive = useMemo(
    () =>
      debouncef((value, delay) => {
        if (latestValueRef.current !== value) {
          receive(value);
          latestValueRef.current = value;
        }
      }), // The debounce function itself will handle the delay
    [receive]
  );

  const statusValidation = (valid, val, error, update) => {
    if (valid) {
      setStatus('');
      setErrorMessage('')
      if (update) {
        setInputValue(val);
        debouncedReceive(val, delay_def); // Pass the custom delay as 1sec
      }
    } else {
      setStatus('error');
      setErrorMessage(error)
      if (update) {
        setInputValue(val);
        debouncedReceive('', delay_def); // Pass the custom delay as 1sec
      }
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;
    const res = hookInputValid(KeyName, value, comp_name, format);
    statusValidation(res.valid, res.value, res.errmsg, true);
  }

  const handleBlur = () => {
    setIconVisible(true);
    const res = hookInputValid(KeyName, inputValue, comp_name, format);
    statusValidation(res.valid, res.value, res.errmsg, true);
  };

  useEffect(() => {
    if (rendered) {
      setIconVisible(true);
      const res = hookInputValid(KeyName, inputValue, comp_name, format);
      console.log( FormatCurrency(res.value.replaceAll(',','')))
      statusValidation(res.valid, (format === 'Currency' ? (res.value? FormatCurrency(res.value.replaceAll(',','')) : '') : res.value ), res.errmsg, true);
    }
  }, [rendered]);

  useEffect(() => {
    return () => {
      debouncedReceive.cancel();
    };
  }, [debouncedReceive]);

  return {
    inputValue,
    status,
    iconVisible,
    handleChange,
    handleBlur,
    errorMessage,
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
