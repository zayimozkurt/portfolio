import { YEAR_MONTH_REGEX } from '@/constants/year-month-regex.constant';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateExperienceDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsBoolean()
    @IsOptional()
    isCurrent?: boolean;

    @IsString()
    @IsOptional()
    @Matches(YEAR_MONTH_REGEX, { message: 'startDate must be in YYYY-MM format' })
    startDate?: string;

    @IsString()
    @IsOptional()
    @Matches(YEAR_MONTH_REGEX, { message: 'endDate must be in YYYY-MM format' })
    endDate?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
