import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderPortfolioItemsDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    orderedIds!: string[];
}
