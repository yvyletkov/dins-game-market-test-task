import React, {useCallback, useMemo} from 'react';
import './TextInput.css';
import {UserShortInfo} from "../../data/types";

let INDEX = 0;

interface TextInputProps {
    children?: any;
    value?: string;
    disabled?: boolean;
    placeholder?: string;
    onChange?: (value: string, id: UserShortInfo['id']) => void;
    className?: string;
    id: UserShortInfo['id'];
}

export function TextInput({children, value, disabled, placeholder, onChange, className, id}: TextInputProps) {
    const handleChange = useCallback((e) => onChange && onChange(e.target.value, id), [onChange]);
    const htmlId = useMemo(() => `text-input_${Date.now()}_${INDEX}`, []);
    return (
        <div className={`text-input ${disabled ? 'text-input--disabled' : ''} ${className || ''}`}>
            {children ? <label htmlFor={htmlId} className="text-input__label">{children}</label> : null}
            <input
                className="text-input__input"
                id={htmlId}
                type="text"
                value={value}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
                data-id={id}
            />
        </div>
    );
}
