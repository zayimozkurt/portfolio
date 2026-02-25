'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function PlaceholderSortablePortfolioItemCard({ id, isAnyDragging }: { id: string; isAnyDragging: boolean }) {
    const { setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`w-[300px] ${isAnyDragging ? 'h-[60px]' : 'h-[350px]'} invisible`}
        />
    );
}
