import { ExtendedUserModel } from '@/types/db/extended-user.model';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadUserByIdResponse extends ResponseBase {
    user?: ExtendedUserModel;
}
