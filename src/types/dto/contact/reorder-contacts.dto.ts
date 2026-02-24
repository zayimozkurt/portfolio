import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderContactsDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    orderedIds!: string[];
}
