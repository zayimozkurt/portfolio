import { ContactLabel } from '@/enums/contact-label.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
    @IsEnum(ContactLabel)
    @IsNotEmpty()
    label!: ContactLabel;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    value!: string;
}
