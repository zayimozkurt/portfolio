import { IsNotEmpty, IsString } from "class-validator";

export class AttachOrDetachEducationSkillDto {
    @IsString()
    @IsNotEmpty()
    educationId!: string;

    @IsString()
    @IsNotEmpty()
    skillId!: string;
}
