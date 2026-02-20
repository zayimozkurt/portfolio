import { IsNotEmpty, IsString } from "class-validator";

export class AttachOrDetachPortfolioItemSkillDto {
    @IsString()
    @IsNotEmpty()
    portfolioItemId!: string;

    @IsString()
    @IsNotEmpty()
    skillId!: string;
}
