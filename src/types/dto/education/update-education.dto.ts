import { YEAR_MONTH_REGEX } from '@/constants/year-month-regex.constant';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateEducationDto {
    @IsString()
    @IsOptional()
    school?: string;

    @IsString()
    @IsOptional()
    degree?: string;

    @IsString()
    @IsOptional()
    fieldOfStudy?: string;

    @IsString()
    @IsOptional()
    description?: string;

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
}
