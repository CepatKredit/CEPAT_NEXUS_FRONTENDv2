import { DateFormat } from '@utils/Formatting';
import { checkAgeisValid, CheckDateValid, checkDeployisValid } from '@utils/Validations';
import dayjs from 'dayjs';
import { useState, useMemo, useCallback, useEffect } from 'react';

export function SelectComponentHooks(search, receive, options, setSearchInput, KeyName) {
    const [status, setStatus] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.label.toLowerCase().includes(search ? search.toLowerCase() : '')
        );
    }, [search, options]);

    useEffect(() => {
        setHighlightedIndex(0);
    }, [search]);

    const handleSelectChange = useCallback((selectedValue) => {
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

    return {
        status,
        highlightedIndex,
        filteredOptions,
        handleSelectChange,
        handleKeyDown
    };
}

export function DateComponentHook(value, receive, rendered, KeyName) {
    const [status, setStatus] = useState('');
    const [iconVisible, setIconVisible] = useState(false);
    const [inputValue, setInputValue] = useState(value ? dayjs(value).format('MM-DD-YYYY') : '');
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const [datePickerValue, setDatePickerValue] = useState(value ? dayjs(value, 'MM-DD-YYYY') : '');
    const [debouncedInput, setDebouncedInput] = useState(inputValue);

    const debounceChange = useCallback((formattedValue) => {
        setDebouncedInput(formattedValue);
    }, []);

    const handleInputChange = (e, readOnly) => {
        if (readOnly) return;
        if(KeyName === 'ofwDeptDate'){ // reset the date when there is disable related in datepicker
            setDatePickerValue('')
        }else{
            setDatePickerValue(CheckDateValid(e.target.value)? dayjs(e.target.value): '')
        }
        const formattedValue = DateFormat(e.target.value);
        setInputValue(formattedValue);
        debounceChange(formattedValue);
    };

    const handleDateChange = (dateValue) => {
        if (CheckDateValid(dateValue)) {
            setDatePickerValue(dateValue)
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
                setIconVisible(true);
                if (KeyName==='Age Restriction' && checkAgeisValid(date)) {
                    setStatus('');
                    receive(date);
                }else if(KeyName==='ofwDeptDate' && checkDeployisValid(date)){
                    setStatus('');
                    receive(date);
              /*  }else if((KeyName===undefined || KeyName==='Normal') && CheckDateValid(date)){
                    setStatus('');
                    receive(date); */
                }else{
                    setStatus('error');
                    receive();
                }
            } else {
                setStatus('error');
                receive();
            }
        }, 200);

        return () => clearTimeout(handler);
    }, [debouncedInput]);

    useEffect(() => {
        if (rendered) { // Not rendered
            setIconVisible(true);
            if (KeyName==='Age Restriction' && checkAgeisValid(value ? dayjs(value).format('MM-DD-YYYY') : '')) {
                setStatus('');
            }else if(KeyName==='ofwDeptDate' && checkDeployisValid(value ? dayjs(value).format('MM-DD-YYYY') : '')){
                setStatus('');
          /*  }else if((KeyName===undefined || KeyName==='Normal') && CheckDateValid(date)){
                setStatus(''); */
            }else{
                setStatus('error');
            }
        }
    }, [value, rendered]);

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
    };
}
