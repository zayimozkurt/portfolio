import { ContactLabel } from '@/enums/contact-label.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
    @IsEnum(ContactLabel)
    @IsOptional()
    label?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    value?: string;
}
