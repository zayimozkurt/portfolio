import { ContactLabel } from '@/enums/contact-label.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
    @IsString()
    @IsNotEmpty()
    id!: string;

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
