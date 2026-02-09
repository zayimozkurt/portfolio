import { Education } from '@/generated/client';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadAllEducationsResponse extends ResponseBase {
    educations?: Education[];
}
