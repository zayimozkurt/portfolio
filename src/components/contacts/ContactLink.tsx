import { contactIconMap } from '@/constants/contact-icon-map.constant';
import { ContactLabel } from '@/enums/contact-label.enum';
import { Contact } from '@/generated/client';

export function ContactLink({ contact }: { contact: Contact }) {
    return (
        <a
            href={contact.label === ContactLabel.EMAIL ? `mailto:${contact.value}` : contact.value}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group text-text-tertiary hover:text-text-primary duration-300 text-lg"
        >
            {contactIconMap[contact.label] ?? contactIconMap[ContactLabel.CUSTOM]}

            <span
                className="absolute left-8 top-1/2 -translate-y-1/2
                bg-navbar-bg text-navbar-text text-xs px-2 py-1 rounded
                opacity-0 group-hover:opacity-100 transition-opacity duration-100
                pointer-events-none whitespace-nowrap"
            >
                {contact.label === ContactLabel.EMAIL ? contact.value : contact.name}
            </span>
        </a>
    );
}
