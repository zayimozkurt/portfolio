'use client';

import { ContactItem } from '@/components/contacts/ContactItem';
import { Contact } from '@/generated/client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableContactItem({
    contact,
    onEdit,
    onDelete,
    isSaving,
}: {
    contact: Contact;
    onEdit: () => void;
    onDelete: () => void;
    isSaving: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: contact.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-1">
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                aria-label={`Drag to reorder ${contact.name}`}
                style={{ touchAction: 'none' }}
            >
                <GripVertical size={18} />
            </button>

            <div className="flex-1 min-w-0">
                <ContactItem
                    contact={contact}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isSaving={isSaving}
                />
            </div>
        </div>
    );
}
