import { Contact } from '@/generated/client';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadAllContactsResponse extends ResponseBase {
    contacts?: Contact[];
}
