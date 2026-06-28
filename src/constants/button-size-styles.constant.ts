import { ButtonSize } from "@/enums/button-size.enum";

export const buttonSizeStyles: Record<ButtonSize, string> = {
    // Compact, for toolbars / inline actions
    [ButtonSize.SMALL]: 'px-3.5 py-2 text-[13px] rounded-lg',
    // Default app-wide size — kept modest on purpose
    [ButtonSize.MEDIUM]: 'px-4 py-2 text-sm',
    // Large — reserved for the home hero CTAs (design Md: pad 12·20)
    [ButtonSize.LARGE]: 'px-5 py-3 text-sm',
    [ButtonSize.ICON]: 'p-2' // Square-ish padding for icon-only buttons
};
