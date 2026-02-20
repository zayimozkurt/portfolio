import { buttonSizeStyles } from '@/constants/button-size-styles.constant';
import { buttonVariantStyles } from '@/constants/button-variant-styles.constant';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { Trash2 } from 'lucide-react';
import type React from 'react';

export function Button({
    children,
    onClick,
    variant = ButtonVariant.PRIMARY,
    size = ButtonSize.MEDIUM,
    isActive,
    ...rest
}: {
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isActive?: boolean;
    [key: string]: unknown;
}) {
    const baseStyles =
        'cursor-pointer border-2 rounded-[10px] duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap';
    const sizeStyles = buttonSizeStyles[size];

    const variantStyles = buttonVariantStyles[variant];

    const activeStyles = isActive && variant === ButtonVariant.TOOLBAR ? 'bg-gray-200 border-gray-500' : '';

    return (
        <button
            onClick={onClick}
            className={`
                ${variant === ButtonVariant.TRASH ? '' : `${baseStyles} ${sizeStyles}`}
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
