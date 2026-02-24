import { IsNotEmpty, IsString } from 'class-validator';

export class UploadSkillImageDto {
    @IsString()
    @IsNotEmpty()
    skillId!: string;
}
