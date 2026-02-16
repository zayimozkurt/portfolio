import { ButtonVariant } from '@/enums/button-variants.enum';

export const buttonVariantStyles: Record<ButtonVariant, string> = {
    [ButtonVariant.PRIMARY]: 'bg-black text-white border-black hover:bg-white hover:text-black',
    [ButtonVariant.SECONDARY]: 'bg-gray-500 text-white border-gray-500 hover:bg-white hover:text-black',
    [ButtonVariant.DANGER]:
        'bg-red-800 text-white border-red-800 hover:bg-white hover:text-red-800 hover:border-red-800',
    [ButtonVariant.GHOST]: 'bg-gray-200 text-gray-500 border-gray-300',
    [ButtonVariant.TOOLBAR]: 'bg-white text-black border-gray-300 hover:bg-gray-100 rounded px-3 py-1 text-sm',
    [ButtonVariant.LINK]: 'bg-transparent text-gray-800 border-transparent hover:text-gray-600 p-0 border-0',
    [ButtonVariant.TRASH]: 'text-gray-400 hover:text-red-500 duration-300 cursor-pointer shrink-0'
};
