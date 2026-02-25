import { AttachOrDetachExperienceSkillDto } from '@/types/dto/relations/experience-skill/attach-experience-skill.dto';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export class ExperienceSkillService {
    private constructor() {}

    static async attach(dto: AttachOrDetachExperienceSkillDto): Promise<ResponseBase> {
        try {
            await prisma.experience.update({
                where: { id: dto.experienceId },
                data: {
                    skills: {
                        connect: { id: dto.skillId }
                    }
                }
            });

            return {
                isSuccess: true,
                message: 'Skill successfully linked to experience',
                statusCode: 200,
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "Internal server error", statusCode: 500 };
        }
    }

    static async detach(dto: AttachOrDetachExperienceSkillDto): Promise<ResponseBase> {
        try {
            await prisma.experience.update({
                where: { id: dto.experienceId },
                data: {
                    skills: {
                        disconnect: { id: dto.skillId }
                    }
                }
            });

            return {
                isSuccess: true,
                message: 'Skill successfully unlinked from experience',
                statusCode: 200,
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
