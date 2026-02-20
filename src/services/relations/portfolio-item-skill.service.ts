import { AttachOrDetachPortfolioItemSkillDto } from '@/types/dto/relations/portfolio-item-skill/attach-portfolio-item-skill.dto';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export class PortfolioItemSkillService {
    private constructor() {}

    static async attach(dto: AttachOrDetachPortfolioItemSkillDto): Promise<ResponseBase> {
        try {
            await prisma.portfolioItem.update({
                where: { id: dto.portfolioItemId },
                data: {
                    skills: {
                        connect: { id: dto.skillId }
                    }
                }
            });

            return {
                isSuccess: true,
                message: 'Skill successfully linked to portfolio item'
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "Internal server error" };
        }
    }

    static async detach(dto: AttachOrDetachPortfolioItemSkillDto): Promise<ResponseBase> {
        try {
            await prisma.portfolioItem.update({
                where: { id: dto.portfolioItemId },
                data: {
                    skills: {
                        disconnect: { id: dto.skillId }
                    }
                }
            });

            return {
                isSuccess: true,
                message: 'Skill successfully unlinked from portfolio item'
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }
}