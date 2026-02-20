import { ButtonSize } from "@/enums/button-size.enum";

export const buttonSizeStyles: Record<ButtonSize, string> = {
    [ButtonSize.SMALL]: 'px-1 py-0.5 text-xs',
    [ButtonSize.MEDIUM]: 'px-2 py-1 text-sm',
    [ButtonSize.LARGE]: 'px-6 py-2 text-base',
    [ButtonSize.ICON]: 'p-2' // Square-ish padding for icon-only buttons
};
