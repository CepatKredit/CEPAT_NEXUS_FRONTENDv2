import * as React from 'react';
import { Input } from 'antd';
import { toUpperText } from '@utils/Converter';

function LabeledTextArea({ className, label, placeHolder, value, receive, disabled, readOnly }) {

    const inputRef = React.useRef(null); 
    const cursorPositionRef = React.useRef(null);

    function onChange(e) {
        cursorPositionRef.current = e.target.selectionStart;
        const upperText = toUpperText(e.target.value);
        receive(upperText);
    }

    React.useLayoutEffect(() => {
        if (inputRef.current && cursorPositionRef.current !== null) {
            inputRef.current.resizableTextArea.textArea.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
        }
    }, [value]); 

    return (
        <div className={className}>
            <div>
                <label className='font-bold'>{label}</label>
            </div>
            <div>
                <Input.TextArea
                    ref={inputRef}
                    className='w-full h-[10rem]'
                    size='large'
                    value={value}
                    placeholder={placeHolder}
                    onChange={onChange}
                    allowClear
                    disabled={disabled}
                    readOnly={readOnly}
                    style={{ resize: 'none' }}
                    showCount
                    maxLength={1000}
                />
            </div>
        </div>
    );
}

export default LabeledTextArea;
