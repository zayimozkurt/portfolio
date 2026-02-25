import { IsNotEmpty, IsString } from "class-validator";

export class AttachOrDetachExperienceSkillDto {
    @IsString()
    @IsNotEmpty()
    experienceId!: string;

    @IsString()
    @IsNotEmpty()
    skillId!: string;
}
