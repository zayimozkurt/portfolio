import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderSkillsDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    orderedIds!: string[];
}
