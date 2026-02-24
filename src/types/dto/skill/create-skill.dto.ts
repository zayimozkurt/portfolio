import { SKILL_NAME_CHAR_LIMIT } from '@/constants/skill-name-char-limit.constant';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(SKILL_NAME_CHAR_LIMIT)
    name!: string;
}
