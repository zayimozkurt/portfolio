'use client';

import { Skill } from '@/generated/client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableSkillPill({
    skill,
    onDelete,
    isSaving,
}: {
    skill: Skill;
    onDelete: (id: string, name: string) => void;
    isSaving: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: skill.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <span
            ref={setNodeRef}
            style={style}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-200 transition-colors flex items-center gap-1.5 select-none"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors -ml-1"
                aria-label={`Drag to reorder ${skill.name}`}
            >
                <GripVertical size={14} />
            </button>
            {skill.name}
            <button
                onClick={() => onDelete(skill.id, skill.name)}
                disabled={isSaving}
                className="text-red-400 hover:text-red-800 transition-colors ml-0.5"
            >
                &times;
            </button>
        </span>
    );
}
