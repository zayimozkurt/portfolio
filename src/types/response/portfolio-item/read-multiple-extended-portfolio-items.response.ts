import { ExtendedPortfolioItemModel } from '@/types/db/extended-portfolio-item.model';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadMultipleExtendedPortfolioItemsResponse extends ResponseBase {
    portfolioItems?: ExtendedPortfolioItemModel[];
}
