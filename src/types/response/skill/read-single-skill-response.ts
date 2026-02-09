import { ExtendedSkillModel } from '@/types/db/extended-skill-model';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadSingleSkillResponse extends ResponseBase {
    skill?: ExtendedSkillModel;
}
