import * as React from 'react';
import './Button.scss';

type ButtonProps = {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'default';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
                           children,
                           variant = 'default',
                           size = 'medium',
                           isLoading = false,
                           className = '',
                           ...props
                       }: ButtonProps) {

    const buttonClasses = [
        'app-button',
        `app-button--${variant}`,
        `app-button--${size}`,
        isLoading ? 'is-loading' : '',
        className
    ].join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div data-uk-spinner="ratio: 0.6"></div>
            ) : (
                children
            )}
        </button>
    );
}