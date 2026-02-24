import { PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-description-char-limit.constant';
import { PORTFOLIO_ITEM_TITLE_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-title-char-limit.constant';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePortfolioItemDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(PORTFOLIO_ITEM_TITLE_CHAR_LIMIT)
    title!: string;

    @IsString()
    @IsOptional()
    @MaxLength(PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT)
    description?: string;
}
