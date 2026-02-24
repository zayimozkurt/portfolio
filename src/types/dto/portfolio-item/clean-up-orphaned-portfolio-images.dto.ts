import type { JsonValue } from '@/generated/client/runtime/library';
import { IsNotEmpty, IsString } from 'class-validator';

export class CleanUpOrphanedPortfolioImagesDto {
    @IsString()
    @IsNotEmpty()
    portfolioItemId!: string;

    @IsNotEmpty()
    content!: JsonValue;
}
