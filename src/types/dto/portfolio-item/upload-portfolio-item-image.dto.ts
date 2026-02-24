import { IsNotEmpty, IsString } from 'class-validator';

export class UploadPortfolioItemImageDto {
    @IsString()
    @IsNotEmpty()
    portfolioItemId!: string;
}
