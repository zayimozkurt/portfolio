import { ContactLabel } from "@/enums/contact-label.enum";
import { CreateContactDto } from "@/types/dto/contact/create-contact.dto";

export const DEFAULT_ADD_FORM: CreateContactDto = { label: ContactLabel.CUSTOM, name: '', value: '' };
