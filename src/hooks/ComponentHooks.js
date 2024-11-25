import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { mmddyy } from '@utils/Converter';
import { debouncef } from '@utils/Debounce';
import { CharacterLimit, DateFormat, FormatComma, FormatCurrency, inputFormat, Uppercase } from '@utils/Formatting';
import { dateMessage, inputMessage } from '@utils/MessageValidationList';
import { checkAgeisValid, CheckDateValid, checkDeployisValid, CheckEmailValid, CheckIncomeValid, CheckRentAmortValid } from '@utils/Validations';
import dayjs from 'dayjs';
import { useState, useMemo, useCallback, useEffect, useRef, useContext } from 'react';


function hookDateValid(KeyName, date) {
  if (KeyName === 'ofwDeptDate' || KeyName === 'loanDateDep' || KeyName === 'ContractDate') { return !checkDeployisValid(date); }
  else if (KeyName === 'ofwbdate' || KeyName === 'ofwspousebdate' || KeyName === "benbdate" || KeyName === "coborrowerspousebdate" || KeyName === "coborrowbdate" || KeyName === "benspousebdate") { return !checkAgeisValid(date) }
  else { return CheckDateValid(date) }
}

function hookInputValid(KeyName, input, comp_name, format, group) {
  //LETTERS
  if (group === 'Email' && CheckEmailValid(input)) {//For Email
    return { valid: true, value: input, errmsg: '' }; //As-is
  } else if (group === 'Uppercase' && input !== '') { //For letters / number
    return { valid: true, value: Uppercase(input), errmsg: '' }; //Change format to uppercase
  } else if (group === 'Default' && input !== '') { //For No-case sensitive
    return { valid: true, value: input, errmsg: '' }; //As-is
  //CURRENCY
  } else if (group === 'Income' && input !== '' && CheckIncomeValid(input)) { // 25,000.00
    return { valid: true, value: inputFormat(format, input), errmsg: '' };
  } else if ((group === 'Rent_Amort' || group === 'Allotment') && input !== '' && CheckRentAmortValid(input)) { // !0
    return { valid: true, value: inputFormat(format, input), errmsg: '' };
  //NUMBER

  } else { //error
    return { valid: false, value: inputFormat(format, input), errmsg: inputMessage(group, inputFormat(format, input) === '' ? 'Empty' : 'Invalid', comp_name) };
  }
}

export function SelectComponentHooks(search, receive, options, setSearchInput, KeyName, rendered, value, setRendered) {
  const { getAppDetails } = useContext(LoanApplicationContext);
  const [status, setStatus] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setselected] = useState(value || '');
  const [debouncedInput, setDebouncedInput] = useState(selected);


  //Fix tomorrow
  const debounceChange = useCallback((formattedValue) => {
    setDebouncedInput(formattedValue);
  }, []);

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

  /*
  useEffect(() => { //Should place to another file?
    setStatus("")
  }, [!getAppDetails.dataPrivacy])*/

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  useEffect(() => {
    setStatus(debouncedInput ? '' : 'error');
    receive(debouncedInput);
  }, [debouncedInput])

  const handleSelectChange = useCallback((selectedValue) => {
    setDropdownOpen(false)
    setRendered(true)
    debounceChange(selectedValue || undefined);
    setselected(selectedValue)
  }, [receive]); //Need monitor in this value

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

  /* affected all clearing
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
    setInputValue(formattedValue);
    debounceChange(formattedValue);
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

  useEffect(() => {
    if (KeyName === 'ofwspousebdate') {
      if (getAppDetails.MarriedPBCB) {
        // When MarriedPBCB is true, set the value from props and validate
        setDatePickerValue(value ? dayjs(value) : '');
        setInputValue(value ? dayjs(value).format('MM-DD-YYYY') : '');
        if (hookDateValid(KeyName, value)) {
          setStatus('error');
          setValidationMessage(dateMessage(KeyName, 'Invalid'));
        } else {
          setStatus('');
          setValidationMessage('');
        }
      } else {
        // When MarriedPBCB is false, clear the date only if value is falsy
        if (!CheckDateValid(dayjs(value).format('MM-DD-YYYY'))) {
          setDatePickerValue('');
          setInputValue('');
          setStatus('error');
          setValidationMessage(dateMessage(KeyName, 'Empty'));
        }
      }
      setRendered(true); // Ensure it reflects the rendered state
    }
  }, [value, getAppDetails.MarriedPBCB, KeyName]);

  const handleBlur = (date) => {
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
    } else {
      setStatus('error');
      setValidationMessage(dateMessage(KeyName, 'Invalid'));
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

export function InputComponentHook(initialValue, receive, rendered, KeyName, comp_name, format, group, isDisabled) {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('');
  const [iconVisible, setIconVisible] = useState(false);
  const latestValueRef = useRef(initialValue);

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

  const statusValidation = (valid, val, error, update, delay_def) => {
    if (valid) {
      setStatus('');
      setErrorMessage('');
      setInputValue(val); // Keep the valid value in the input field
      debouncedReceive(val, delay_def); // Pass the custom delay
    } else {
      setStatus('error');
      setErrorMessage(error);
      setInputValue(val); // Keep the valid value in the input field
      if (update) {
        debouncedReceive('', delay_def); // Pass an empty string only to the receiver
      }
    }
  };

  const handleChange = (e) => {
    let value = e;
    const maxchar = CharacterLimit(group);
    if (maxchar && value.length > maxchar) {
      value = value.slice(0, maxchar);
    }

    const res = hookInputValid(KeyName, value , comp_name, format, group);
    statusValidation(res.valid, res.value, res.errmsg, true, 800);
  }

  const handleBlur = () => {
    setIconVisible(true);
    const res = hookInputValid(KeyName, inputValue, comp_name, format, group);
    statusValidation(res.valid, (format === 'Currency' ? (res.value ? FormatCurrency(res.value.replaceAll(',', '')) : '') : res.value), res.errmsg, false, 100);
  };

  useEffect(() => { //INITIAL RELOAD
    if (rendered) {
      setIconVisible(true);
      const res = hookInputValid(KeyName, initialValue /* || inputValue */, comp_name, format, group);
      statusValidation(res.valid, (format === 'Currency' ? (res.value ? FormatCurrency(res.value.replaceAll(',', '')) : '') : res.value), res.errmsg, true, 100);
    }
  }, [rendered]);

  useEffect(() => {
    if(isDisabled || initialValue === ''){
        handleChange(initialValue);    
    }    
  }, [initialValue])


  /*
    useEffect(() => { //SPECIFIC FIELDS ONLY
      if (comp_name === 'Spouse Name' || comp_name === 'Spouse Income') {
        setIconVisible(true);
        const res = hookInputValid(KeyName, initialValue , comp_name, format, group);
        statusValidation(res.valid, (format === 'Currency' ? (res.value ? FormatComma(res.value.replaceAll(',', '')) : '') : res.value), res.errmsg, true, 100);
      }
    }, [initialValue])
    */

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
