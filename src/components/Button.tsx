import { buttonVariantStyles } from '@/constants/button-variant-styles.constant';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { Trash2 } from 'lucide-react';
import type React from 'react';

export function Button({
    children,
    onClick,
    variant = ButtonVariant.PRIMARY,
    isActive,
    ...rest
}: {
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    variant?: ButtonVariant;
    isActive?: boolean;
    [key: string]: unknown;
}) {
    const baseStyles =
        'cursor-pointer px-2 py-0.5 border-2 rounded-[10px] text-s duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const variantStyles = buttonVariantStyles[variant];

    const activeStyles = isActive && variant === ButtonVariant.TOOLBAR ? 'bg-gray-200 border-gray-500' : '';

    return (
        <button
            onClick={onClick}
            className={`
                ${variant === ButtonVariant.TRASH ? '' : baseStyles}
                ${variantStyles}
                ${activeStyles}
            `}
            {...rest}
        >
            {variant === ButtonVariant.TRASH ?
                <Trash2 size={16} />
                :
                children
            }
        </button>
    );
}
