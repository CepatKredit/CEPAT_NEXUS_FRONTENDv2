import React, { useState, useMemo, useCallback, useEffect } from 'react';

function SelectComponentTabHooks({ search, receive, dataQuery,setSearchInput }) {
    const [status, setStatus] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const filteredOptions = useMemo(() => {
        return dataQuery.filter(option =>
            option.label.toLowerCase().includes(search ? search.toLowerCase() : '')
        );
    }, [search, dataQuery]);

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

export default SelectComponentTabHooks;
