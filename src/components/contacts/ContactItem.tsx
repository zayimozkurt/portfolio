import { contactIconMap } from '@/constants/contact-icon-map.constant';
import { ContactLabel } from '@/enums/contact-label.enum';
import { Contact } from '@/generated/client';
import { Pencil, Trash2 } from 'lucide-react';

export function ContactItem({
    contact,
    onEdit,
    onDelete,
    isSaving,
}: {
    contact: Contact;
    onEdit: () => void;
    onDelete: () => void;
    isSaving?: boolean;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm shrink-0">
                {contactIconMap[contact.label] ?? contactIconMap[ContactLabel.CUSTOM]}
            </span>
            <span className="text-xs font-medium shrink-0">
                {contact.name}
            </span>
            <span className="text-xs text-gray-600 truncate flex-1">
                {contact.value}
            </span>
            <button
                onClick={onEdit}
                className="text-gray-400 hover:text-black duration-300 cursor-pointer shrink-0"
                disabled={isSaving}
            >
                <Pencil size={12} />
            </button>
            <button
                onClick={onDelete}
                className="text-gray-400 hover:text-red-500 duration-300 cursor-pointer shrink-0"
                disabled={isSaving}
            >
                <Trash2 size={12} />
            </button>
        </div>
    );
}
