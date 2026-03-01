import { AssociatedItemsRowSize } from "@/enums/associated-items-row-size.enum";

export const associatedItemsRowSizeStyles: Record<AssociatedItemsRowSize, string> = {
    [AssociatedItemsRowSize.SMALL]: 'h-[30px] gap-3 text-xs',
    [AssociatedItemsRowSize.MEDIUM]: 'h-[40px] gap-4 p-2 text-sm',
};
