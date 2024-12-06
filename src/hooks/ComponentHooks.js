import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { mmddyy } from '@utils/Converter';
import { debouncef } from '@utils/Debounce';
import { CharacterLimit, DateFormat, FormatComma, FormatCurrency, inputFormat, Uppercase } from '@utils/Formatting';
import { dateMessage, inputMessage } from '@utils/MessageValidationList';
import { checkAgeisValid, CheckAmountValid, CheckContactNo, CheckDateValid, checkDeployisValid, CheckEmailValid, CheckFBLinkValid, CheckIncomeValid, CheckRentAmortValid } from '@utils/Validations';
import dayjs from 'dayjs';
import { useState, useMemo, useCallback, useEffect, useRef, useContext } from 'react';

function hookDateValid(KeyName, date) {
  if (KeyName === 'ofwDeptDate' || KeyName === 'loanDateDep') { return checkDeployisValid(date); }
  else if (KeyName === 'ofwbdate' || KeyName === 'ofwspousebdate' || KeyName === "benbdate" || KeyName === "coborrowerspousebdate" || KeyName === "coborrowbdate" || KeyName === "benspousebdate") { return checkAgeisValid(date) }
  else { return CheckDateValid(date) }
}

function hookInputValid(KeyName, input, comp_name, format, group, InvalidMsg, EmptyMsg) {
  //LETTERS
  if (group === 'Email' && CheckEmailValid(input)) {//For Email
    return { valid: true, value: input, errmsg: '' }; //As-is
  } else if (group === 'ContactNo' && /*input !== '' &&*/ CheckContactNo(input, format)) { //For Numbers
    return { valid: true, value: inputFormat(format, input), errmsg: '' }; //Change format to uppercase
  } else if (group === 'Uppercase' && input !== '') { //For letters / number
    return { valid: true, value: Uppercase(input), errmsg: '' }; //Change format to uppercase
  } else if (group === 'FBLink' && input !== '' && CheckFBLinkValid(input)) { //FBlink Format
    return { valid: true, value: inputFormat(format, input), errmsg: '' }; //Change format to http link
  } else if (group === 'Default' && input !== '') { //For No-case sensitive
    return { valid: true, value: input, errmsg: '' }; //As-is
    //CURRENCY
  } else if (group === 'Income' && input !== '' && CheckIncomeValid(input)) { // 25,000.00
    return { valid: true, value: inputFormat(format, input), errmsg: '' };
  } else if (group === 'Amount-30,000' && input !== '' && CheckAmountValid(input)) { // 30,000.00
    return { valid: true, value: inputFormat(format, input), errmsg: '' };
  } else if ((group === 'Rent_Amort' || group === 'Allotment') && input !== '' && CheckRentAmortValid(input)) { // !0
    return { valid: true, value: inputFormat(format, input), errmsg: '' };
    /* } else if ((group === 'Number' ) && input !== '' && CheckNumberValid()) { // !0
       return { valid: true, value: inputFormat(format, input), errmsg: '' };*/
    //NUMBER

  } else { //error
    return { valid: false, value: inputFormat(format, input), errmsg: inputMessage(group, inputFormat(format, input) === '' ? 'Empty' : 'Invalid', comp_name, InvalidMsg, EmptyMsg) };
  }
}

export function SelectComponentHooks(search, receive, options, setSearchInput, KeyName, rendered, value = '', setRendered, InvalidMsg, EmptyMsg) {
  const [status, setStatus] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setselected] = useState(value);
  const [debouncedInput, setDebouncedInput] = useState(selected);
  const [ErrorMsg, setErrorMsg] = useState('EMPTY')

  const debounceChange = useCallback((formattedValue) => {
    setDebouncedInput(formattedValue);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!options || options.length === 0) return [];
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

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  useEffect(() => {
    setStatus(debouncedInput ? '' : 'error');
    setErrorMsg(debouncedInput ? '' : 'EMPTY')
    receive(debouncedInput);
  }, [debouncedInput])

  const handleSelectChange = useCallback((selectedValue) => {
    setDropdownOpen(false)
    setRendered(true)
    debounceChange(selectedValue);
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
        setErrorMsg('EMPTY')
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
    ErrorMsg,
  };
}

export function DateComponentHook(value, rendered, receive, KeyName, setRendered, InvalidMsg, EmptyMsg) {
  const { getAppDetails } = useContext(LoanApplicationContext)
  const [status, setStatus] = useState('');
  const [iconVisible, setIconVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value ? dayjs(value).format('MM-DD-YYYY') : '');
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(value ? dayjs(value, 'MM-DD-YYYY') : '');
  const [debouncedInput, setDebouncedInput] = useState(inputValue);
  const [validationMessage, setValidationMessage] = useState('');

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
        if (!hookDateValid(KeyName, date)) {
          setRendered(true);
          setStatus('error');
          setValidationMessage(InvalidMsg);

        } else {
          setRendered(true);
          setIconVisible(true);
          setValidationMessage('');
          setStatus('');
          receive(date ? mmddyy(date) : '')
        }
      } else if (debouncedInput.length === 0 && (rendered === false || rendered === undefined)) {
        setStatus('error');
        receive()
      } else if (rendered === true && debouncedInput.length === 0) {
        setRendered(true);
        setStatus('error');
        setValidationMessage(EmptyMsg);
      } else {
        setRendered(true);
        setStatus('error');
        setValidationMessage(InvalidMsg);
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
      if (!hookDateValid(KeyName, inputValue)) {
        setStatus('error');
      } else {
        setStatus('');
      }
      setDatePickerValue(CheckDateValid(inputValue) ? dayjs(inputValue) : '');
    }
  }, []);

  useEffect(() => {
    if (KeyName === 'ofwspousebdate' || KeyName === 'benspousebdate') {
      if (getAppDetails.MarriedPBCB) {
        // When MarriedPBCB is true, set the value from props and validate
        setDatePickerValue(value ? dayjs(value) : '');
        setInputValue(value ? dayjs(value).format('MM-DD-YYYY') : '');
        if (!hookDateValid(KeyName, value)) {
          setStatus('error');
          setValidationMessage(InvalidMsg);
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
          setValidationMessage(EmptyMsg);
        }
      }
      setRendered(true); // Ensure it reflects the rendered state
    }
  }, [value, getAppDetails.MarriedPBCB, KeyName]);

  const handleBlur = (date) => { //Immedietly trigger update receive from context
    if (debouncedInput.length === 10 && CheckDateValid(date)) { //Inputvalue is not defined after initilized
      if (!hookDateValid(KeyName, date)) {
        setStatus('error');
        setValidationMessage(EmptyMsg);
        receive()
      } else {
        setIconVisible(true);
        setValidationMessage('');
        setStatus('');
        receive(date ? mmddyy(date) : '')
      }
    } else if (debouncedInput.length === 0) {
      setStatus('error');
      receive()
      setValidationMessage(EmptyMsg);
    } else {
      setStatus('error');
      receive()
      setValidationMessage(InvalidMsg);
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

export function InputComponentHook(
  initialValue,
  receive,
  rendered,
  KeyName,
  comp_name,
  format,
  group,
  isDisabled,
  isFocused,
  InvalidMsg,
  EmptyMsg,
  readOnly
) {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('');
  const [iconVisible, setIconVisible] = useState(false);

  const inputRef = useRef(null); // Reference to the input element
  const latestValueRef = useRef(initialValue); // Track the latest value
  const cursorPosition = useRef(null); // Track cursor position

  const debouncedReceive = useMemo(
    () =>
      debouncef((value) => {
        if (latestValueRef.current !== value) {
          receive(value);
          latestValueRef.current = value;
        }
      }, 800), // Debounce with 800ms delay
    [receive]
  );

  const statusValidation = (valid, val, error) => {
    if (valid) {
      setStatus('');
      setErrorMessage('');
      setInputValue(val);
      debouncedReceive(val);
    } else {
      setStatus('error');
      setErrorMessage(error);
      setInputValue(val);
    }
  };

  const handleChange = (e) => {
    const { value, selectionStart, selectionEnd } = e.target;

    // Save initial cursor position
    let cursorOffset = selectionStart;

    let processedValue = value;
    const maxchar = CharacterLimit(group, format);

    // Limit character length if needed
    if (maxchar && value.length > maxchar) {
      processedValue = value.slice(0, maxchar);
    }
    // Handle specific formatting (e.g., currency or phone number)
    if (format === 'Currency') {
      const rawValue = value.replace(/,/g, ''); // Remove all existing commas
      const selectionStartRaw = selectionStart - (value.slice(0, selectionStart).match(/,/g)?.length || 0); // Cursor in raw value
      processedValue = FormatComma(rawValue); // Format the value and add commas
      // Count commas added up to the previous cursor position
      const newCursorOffset = processedValue.slice(0, selectionStartRaw).match(/,/g)?.length || 0;
      // Update cursor offset considering added commas
      cursorOffset = selectionStartRaw + newCursorOffset;
    } else if (format === '+639') {
      processedValue = formatPhoneNumber(value, format);
    }

    // Validate the processed value
    const validation = hookInputValid(KeyName, processedValue, comp_name, format, group, InvalidMsg, EmptyMsg);

    // Update status and value based on validation
    statusValidation(validation.valid, validation.value, validation.errmsg);

    // Restore adjusted cursor position after formatting
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(cursorOffset, cursorOffset);
      }
    }, 0);
  };

  const handleBlur = () => {
    setIconVisible(true);

    const validation = hookInputValid(KeyName, inputValue, comp_name, format, group, InvalidMsg, EmptyMsg);
    statusValidation(validation.valid, validation.value, validation.errmsg);
  };

  useEffect(() => {
    if (rendered && initialValue !== latestValueRef.current) {
      setInputValue(initialValue || '');
      latestValueRef.current = initialValue;
    }
  }, [initialValue, rendered]);

  useEffect(() => {
    if (inputRef.current && cursorPosition.current) {
      inputRef.current.setSelectionRange(cursorPosition.current.start, cursorPosition.current.end);
    }
  }, [inputValue]);

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
    inputRef,
  };
}

// Utility function for phone number formatting
function formatPhoneNumber(value, format) {
  if (value.startsWith('09')) return `${format}${value.slice(2)}`;
  if (value.startsWith('639')) return `${format}${value.slice(3)}`;
  if (value.startsWith('9')) return `${format}${value.slice(1)}`;
  return value;
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
