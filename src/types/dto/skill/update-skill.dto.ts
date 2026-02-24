import { SKILL_NAME_CHAR_LIMIT } from '@/constants/skill-name-char-limit.constant';
import type { JsonValue } from '@/generated/client/runtime/library';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSkillDto {
    @IsString()
    @IsOptional()
    @MaxLength(SKILL_NAME_CHAR_LIMIT)
    name?: string;

    @IsOptional()
    content?: JsonValue;
}
