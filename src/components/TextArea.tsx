import type React from 'react';

export function TextArea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
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
