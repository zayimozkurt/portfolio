'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function PlaceholderSortableSkillPill({ id }: { id: string }) {
    const { setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div className="w-full flex justify-center">
            <span
                ref={setNodeRef}
                style={style}
                className="max-w-[220px] w-full h-[32px] rounded-full invisible"
            />
        </div>
    );
}
