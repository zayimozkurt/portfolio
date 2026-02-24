import { YEAR_MONTH_REGEX } from '@/constants/year-month-regex.constant';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateExperienceDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    company!: string;

    @IsBoolean()
    @IsNotEmpty()
    isCurrent!: boolean;

    @IsString()
    @Matches(YEAR_MONTH_REGEX, { message: 'startDate must be in YYYY-MM format' })
    @IsNotEmpty()
    startDate!: string;

    @IsString()
    @Matches(YEAR_MONTH_REGEX, { message: 'endDate must be in YYYY-MM format' })
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
