import { ResponseBase } from '@/types/response/response-base';

export interface UserSignInResponse extends ResponseBase {
    jwt?: string;
}
