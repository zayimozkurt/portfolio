import { ButtonVariant } from '@/enums/button-variant.enum';

export const buttonVariantStyles: Record<ButtonVariant, string> = {
    [ButtonVariant.PRIMARY]: 'bg-btn-primary-bg text-btn-primary-text border-btn-primary-border hover:bg-btn-primary-hover-bg hover:text-btn-primary-hover-text',
    [ButtonVariant.SECONDARY]: 'bg-text-tertiary text-surface border-text-tertiary hover:bg-surface hover:text-text-primary',
    [ButtonVariant.DANGER]:
        'bg-danger text-danger-text border-danger hover:bg-surface hover:text-danger hover:border-danger',
    [ButtonVariant.GHOST]: 'bg-surface-tertiary text-text-tertiary border-border-muted',
    [ButtonVariant.TOOLBAR]: 'bg-surface text-text-primary border-border-muted hover:bg-surface-tertiary rounded px-3 py-1 text-sm',
    [ButtonVariant.LINK]: 'bg-transparent text-text-secondary border-transparent hover:text-text-tertiary p-0 border-0',
    [ButtonVariant.TRASH]: 'text-text-muted hover:text-red-500 duration-300 cursor-pointer shrink-0'
};
