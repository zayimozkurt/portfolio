import { ResponseBase } from "@/types/response/response-base";

export interface ValidateDtoResponse<T = any> extends ResponseBase {
    body?: T;
}
