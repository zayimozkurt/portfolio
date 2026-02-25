import { AttachOrDetachEducationSkillDto } from '@/types/dto/relations/education-skill/attach-education-skill.dto';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export class EducationSkillService {
    private constructor() {}

    static async attach(dto: AttachOrDetachEducationSkillDto): Promise<ResponseBase> {
        try {
            await prisma.education.update({
                where: { id: dto.educationId },
                data: {
                    skills: {
                        connect: { id: dto.skillId }
                    }
                }
            });

            return {
                isSuccess: true,
                message: 'Skill successfully linked to education',
                statusCode: 200,
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "Internal server error", statusCode: 500 };
        }
    }

    static async detach(dto: AttachOrDetachEducationSkillDto): Promise<ResponseBase> {
        try {
            await prisma.education.update({
                where: { id: dto.educationId },
                data: {
                    skills: {
                        disconnect: { id: dto.skillId }
                    }
                }
            });

            return {
                isSuccess: true,
                message: 'Skill successfully unlinked from education',
                statusCode: 200,
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
