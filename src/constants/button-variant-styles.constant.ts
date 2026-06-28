import { ButtonVariant } from '@/enums/button-variant.enum';

export const buttonVariantStyles: Record<ButtonVariant, string> = {
    // Primary · solid accent, dims on hover
    [ButtonVariant.PRIMARY]:
        'bg-btn-primary-bg text-btn-primary-text border-transparent hover:opacity-[0.88]',
    // Secondary · outline
    [ButtonVariant.SECONDARY]:
        'bg-transparent text-text-primary border-border-muted hover:border-text-muted',
    // Destructive · solid claret
    [ButtonVariant.DANGER]: 'bg-danger text-danger-text border-transparent hover:opacity-90',
    // Destructive · outline claret
    [ButtonVariant.DESTRUCTIVE_OUTLINE]:
        'bg-transparent text-danger border-danger hover:bg-danger/10',
    [ButtonVariant.GHOST]: 'bg-surface-tertiary text-text-tertiary border-border-muted',
    [ButtonVariant.TOOLBAR]:
        'bg-surface text-text-primary border-border-muted hover:bg-surface-tertiary rounded px-3 py-1 text-sm',
    // Tertiary · mono link
    [ButtonVariant.LINK]:
        'bg-transparent text-text-secondary border-transparent font-mono font-medium hover:text-text-primary p-0 border-0',
    [ButtonVariant.TRASH]: 'text-text-muted hover:text-danger duration-300 cursor-pointer shrink-0',
};
