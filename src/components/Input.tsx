import type React from 'react';

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full py-1 px-3 border border-input-border rounded-[10px]
                text-s text-input-text placeholder-input-placeholder
                bg-surface outline-none
                duration-300
                ${className ?? ''}
            `}
            {...rest}
        />
    );
}
