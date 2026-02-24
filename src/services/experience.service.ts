import { userId } from '@/constants/user-id.constant';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { UpdateExperienceDto } from '@/types/dto/experience/update-experience.dto';
import { ReadAllExperiencesResponse } from '@/types/response/experience/read-all-experiences.response';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export class ExperienceService {
    private constructor() {}

    static async create(dto: CreateExperienceDto): Promise<ResponseBase> {
        if (!dto.isCurrent && dto.endDate && dto.endDate < dto.startDate) {
            return { isSuccess: false, message: 'End date cannot be before start date', statusCode: 400 };
        }

        try {
            await prisma.experience.create({
                data: {
                    userId,
                    title: dto.title,
                    company: dto.company,
                    isCurrent: dto.isCurrent,
                    startDate: new Date(dto.startDate + '-01'),
                    endDate: dto.isCurrent ? null : new Date(dto.endDate + '-01'),
                },
            });
            return { isSuccess: true, message: 'experience created', statusCode: 201 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readAllByUserId(): Promise<ReadAllExperiencesResponse> {
        try {
            const experiences = await prisma.experience.findMany({
                where: { userId },
                orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
                include: { skills: true }
            });
            console.log("experiences: ", experiences);
            return { isSuccess: true, message: 'all experiences read', experiences, statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async updateById(id: string, dto: UpdateExperienceDto): Promise<ResponseBase> {
        try {
            const experience = await prisma.experience.findUnique({ where: { id } });
            if (!experience) {
                return { isSuccess: false, message: 'experience not found', statusCode: 404 };
            }

            const startDate = dto.startDate ?? experience.startDate.toISOString().slice(0, 7);
            const endDate = dto.endDate ?? (experience.endDate ? experience.endDate.toISOString().slice(0, 7) : undefined);
            const isCurrent = dto.isCurrent ?? experience.isCurrent;

            if (!isCurrent && endDate && endDate < startDate) {
                return { isSuccess: false, message: 'End date cannot be before start date', statusCode: 400 };
            }

            const { startDate: startDateDto, endDate: endDateDto, isCurrent: isCurrentDto, ...restOfDto } = dto;

            await prisma.experience.update({
                where: { id },
                data: {
                    isCurrent,
                    startDate: startDateDto ? new Date(startDateDto + '-01') : experience.startDate,
                    endDate: isCurrent ? null : endDateDto ? new Date(endDateDto + '-01') : experience.endDate,
                    ...restOfDto,
                },
            });
            return { isSuccess: true, message: 'experience updated', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async deleteById(id: string): Promise<ResponseBase> {
        try {
            const experience = await prisma.experience.findUnique({ where: { id } });
            if (!experience) {
                return { isSuccess: false, message: 'experience not found', statusCode: 404 };
            }

            await prisma.experience.delete({ where: { id } });
            return { isSuccess: true, message: 'experience deleted', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
