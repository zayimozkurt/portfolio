import { userId } from '@/constants/user-id.constant';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { DeleteExperienceDto } from '@/types/dto/experience/delete-experience.dto';
import { UpdateExperienceDto } from '@/types/dto/experience/update-experience.dto';
import { ReadAllExperiencesResponse } from '@/types/response/experience/read-all-experiences-response';
import { ResponseBase } from '@/types/response/response-base';
import { isValidYearMonth } from '@/utils/validate-year-month.util';
import { prisma } from 'prisma/prisma-client';

export class ExperienceService {
    private constructor() {}

    static async create(dto: CreateExperienceDto): Promise<ResponseBase> {
        if (!isValidYearMonth(dto.startDate)) {
            return { isSuccess: false, message: 'Invalid start date format. Use YYYY-MM' };
        }

        if (!dto.isCurrent && dto.endDate) {
            if (!isValidYearMonth(dto.endDate)) {
                return { isSuccess: false, message: 'Invalid end date format. Use YYYY-MM' };
            }
            if (dto.endDate < dto.startDate) {
                return { isSuccess: false, message: 'End date cannot be before start date' };
            }
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
            return { isSuccess: true, message: 'experience created' };
        } catch {
            return { isSuccess: false, message: "experience couldn't be created" };
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
            return { isSuccess: true, message: 'all experiences read', experiences };
        } catch {
            return { isSuccess: false, message: "experiences couldn't be read" };
        }
    }

    static async updateById(dto: UpdateExperienceDto): Promise<ResponseBase> {
        try {
            const experience = await prisma.experience.findUnique({ where: { id: dto.id } });
            if (!experience) {
                return { isSuccess: false, message: 'experience not found' };
            }

            if (dto.startDate && !isValidYearMonth(dto.startDate)) {
                return { isSuccess: false, message: 'Invalid start date format. Use YYYY-MM' };
            }
            if (dto.endDate && !isValidYearMonth(dto.endDate)) {
                return { isSuccess: false, message: 'Invalid end date format. Use YYYY-MM' };
            }

            const startDate = dto.startDate ?? experience.startDate.toISOString().slice(0, 7);
            const endDate = dto.endDate ?? (experience.endDate ? experience.endDate.toISOString().slice(0, 7) : undefined);
            const isCurrent = dto.isCurrent ?? experience.isCurrent;

            if (!isCurrent && endDate && endDate < startDate) {
                return { isSuccess: false, message: 'End date cannot be before start date' };
            }

            await prisma.experience.update({
                where: { id: dto.id },
                data: {
                    title: dto.title ?? experience.title,
                    company: dto.company ?? experience.company,
                    isCurrent: dto.isCurrent ?? experience.isCurrent,
                    startDate: dto.startDate ? new Date(dto.startDate + '-01') : experience.startDate,
                    endDate: dto.isCurrent ? null : dto.endDate ? new Date(dto.endDate + '-01') : experience.endDate,
                    description: dto.description ?? experience.description,
                },
            });
            return { isSuccess: true, message: 'experience updated' };
        } catch {
            return { isSuccess: false, message: "experience couldn't be updated" };
        }
    }

    static async deleteById(dto: DeleteExperienceDto): Promise<ResponseBase> {
        try {
            const experience = await prisma.experience.findUnique({ where: { id: dto.id } });
            if (!experience) {
                return { isSuccess: false, message: 'experience not found' };
            }

            await prisma.experience.delete({ where: { id: dto.id } });
            return { isSuccess: true, message: 'experience deleted' };
        } catch {
            return { isSuccess: false, message: "experience couldn't be deleted" };
        }
    }
}
