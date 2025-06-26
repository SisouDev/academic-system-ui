import * as React from 'react';

type InputProps = {
    label: string;
    name: string;
    icon?: React.ReactNode;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, name, icon, error, className = '', ...props }, ref) => {

        const hasError = !!error;

        return (
            <div className={`app-input-field ${hasError ? 'is-invalid' : ''} ${className}`}>
                <label htmlFor={name} className="app-input-label">
                    {label}
                </label>

                <div className="app-input-wrapper">
                    {icon && <span className="app-input-icon">{icon}</span>}
                    <input
                        id={name}
                        name={name}
                        className={`app-input ${icon ? 'has-icon' : ''}`}
                        ref={ref}
                        {...props}
                    />
                </div>

                {hasError && <p className="app-input-error-message">{error}</p>}
            </div>
        );
    }
);