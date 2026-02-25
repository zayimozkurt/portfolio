import { Experience } from '@/generated/client';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadAllExperiencesResponse extends ResponseBase {
    experiences?: Experience[];
}
