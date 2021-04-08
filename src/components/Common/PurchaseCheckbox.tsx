import React, {useCallback, useState} from 'react';
import './PurchaseCheckbox.css';
import {UserShortInfo} from "../../data/types";

export interface PurchaseCheckboxProps {
    children: any;
    error?: boolean;
    errorText?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean, id: UserShortInfo['id'] | null) => void;
    className?: string;
    id?: any;
}

export function PurchaseCheckbox({children, checked, disabled, onChange, className, id, error, errorText}: PurchaseCheckboxProps) {

    const [showError, setShowError] = useState(false)
    const handleChange = useCallback(() => {
        if (onChange && id) {
            if (error) setShowError(true)
            else onChange (!checked, id)
        }
        else onChange && onChange(!checked, null)
    }, [checked, onChange, error, id]);

    return (
        <div className={`checkbox ${disabled ? 'checkbox--disabled' : ''} ${className || ''}`}>
            <label className="checkbox__label">
                <input
                    className="checkbox__input"
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                />
                <span className="checkbox__label-content">
                    {children}
                </span>
            </label>
            {showError && <div className="checkbox__error">{errorText}</div>}
        </div>
    );
}
