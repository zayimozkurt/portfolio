'use client';

import { SKILL_NAME_CHAR_LIMIT } from '@/constants/skill-name-char-limit.constant';
import { Skill } from '@/generated/client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Pencil } from 'lucide-react';
import React, { useState } from 'react';

export function SortableSkillPill({
    skill,
    onDelete,
    onRename,
    isSaving,
    className
}: {
    skill: Skill;
    onDelete: (id: string, name: string) => void;
    onRename: (id: string, newName: string) => Promise<boolean>;
    isSaving: boolean;
    className?: string;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(skill.name);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: skill.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    async function handleConfirm() {
        const trimmed = editName.trim();
        if (!trimmed || trimmed === skill.name) {
            setIsEditing(false);
            return;
        }
        const success = await onRename(skill.id, trimmed);
        if (success) setIsEditing(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') { setEditName(skill.name); setIsEditing(false); }
    }

    return (
        <div className='w-full flex justify-center items'>
            <span
                ref={setNodeRef}
                style={style}
                className={`max-w-[220px] h-auto
                    px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 text-gray-700 font-medium rounded-full border
                    text-xs ${skill.name.length > SKILL_NAME_CHAR_LIMIT / 2 ? '' : 'sm:text-sm'}
                    border-gray-200 hover:bg-gray-200 transition-colors flex items-center gap-0.5 sm:gap-1.5 select-none
                    ${className}
                `}
            >
                {isSaving || isEditing ? (
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors -ml-1"
                        aria-label={`Drag to reorder ${skill.name}`}
                        disabled={true}
                    >
                        <GripVertical size={14} color='gray' />
                    </button>
                ) : (
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors -ml-1"
                        aria-label={`Drag to reorder ${skill.name}`}
                    >
                        <GripVertical size={14} color='black' />
                    </button>
                )}

                {isEditing ? (
                    <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={SKILL_NAME_CHAR_LIMIT}
                        disabled={isSaving}
                        className="w-[100px] sm:w-[150px] min-w-0 bg-transparent outline-none border-b border-black text-xs"
                    />
                ) : (
                    <p className='max-w-[115px] sm:max-w-[175px] truncate'>{skill.name}</p>
                )}

                {isEditing ? (
                    <button
                        onClick={handleConfirm}
                        disabled={isSaving}
                        className="text-black hover:text-gray-700 transition-colors cursor-pointer shrink-0"
                    >
                        <Check size={12} />
                    </button>
                ) : (
                    <button
                        onClick={() => { setEditName(skill.name); setIsEditing(true); }}
                        disabled={isSaving}
                        className="text-gray-400 hover:text-black transition-colors cursor-pointer shrink-0"
                    >
                        <Pencil size={12} />
                    </button>
                )}

                <button
                    onClick={() => onDelete(skill.id, skill.name)}
                    disabled={isSaving}
                    className={`cursor-pointer ${isSaving ? 'text-red-200' : 'text-red-400'} hover:text-red-800 transition-colors ml-0.5`}
                >
                    &times;
                </button>
            </span>
        </div>
    );
}
