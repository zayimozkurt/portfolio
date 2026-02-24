import { PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-description-char-limit.constant';
import { PORTFOLIO_ITEM_TITLE_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-title-char-limit.constant';
import type { JsonValue } from '@/generated/client/runtime/library';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePortfolioItemDto {
    @IsString()
    @IsOptional()
    @MaxLength(PORTFOLIO_ITEM_TITLE_CHAR_LIMIT)
    title?: string;

    @IsString()
    @IsOptional()
    @MaxLength(PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT)
    description?: string;

    @IsOptional()
    content?: JsonValue;

    coverImageUrl?: string | null;
}
