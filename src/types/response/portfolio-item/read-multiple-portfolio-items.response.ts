import { PortfolioItem } from '@/generated/client';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadMultiplePortfolioItemsResponse extends ResponseBase {
    portfolioItems?: PortfolioItem[];
}
