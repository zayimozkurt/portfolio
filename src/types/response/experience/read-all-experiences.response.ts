import { ExtendedExperienceModel } from '@/types/db/extended-experience.model';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadAllExperiencesResponse extends ResponseBase {
    experiences?: ExtendedExperienceModel[];
}
