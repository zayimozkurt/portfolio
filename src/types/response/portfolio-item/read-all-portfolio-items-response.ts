import { PortfolioItem } from '@/generated/client';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadAllPortfolioItemsResponse extends ResponseBase {
    portfolioItems?: PortfolioItem[];
}
