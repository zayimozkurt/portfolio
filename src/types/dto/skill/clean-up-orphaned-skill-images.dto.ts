import type { JsonValue } from '@/generated/client/runtime/library';
import { IsNotEmpty, IsString } from 'class-validator';

export class CleanUpOrphanedSkillImagesDto {
    @IsString()
    @IsNotEmpty()
    skillId!: string;

    @IsNotEmpty()
    content!: JsonValue;
}
