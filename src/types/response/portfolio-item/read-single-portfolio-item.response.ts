import { PortfolioItem } from '@/generated/client';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadSinglePortfolioItemResponse extends ResponseBase {
    portfolioItem?: PortfolioItem;
}
