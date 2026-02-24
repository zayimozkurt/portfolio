import { userId } from '@/constants/user-id.constant';
import { CreateEducationDto } from '@/types/dto/education/create-education.dto';
import { UpdateEducationDto } from '@/types/dto/education/update-education.dto';
import { ReadAllEducationsResponse } from '@/types/response/education/read-all-educations.response';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export class EducationService {
    private constructor() {}

    static async create(dto: CreateEducationDto): Promise<ResponseBase> {
        if (!dto.isCurrent && dto.endDate && dto.endDate < dto.startDate) {
            return { isSuccess: false, message: 'End date cannot be before start date', statusCode: 400 };
        }

        try {
            await prisma.education.create({
                data: {
                    userId,
                    school: dto.school,
                    degree: dto.degree,
                    fieldOfStudy: dto.fieldOfStudy,
                    description: dto.description,
                    isCurrent: dto.isCurrent,
                    startDate: new Date(dto.startDate + '-01'),
                    endDate: dto.isCurrent ? null : new Date(dto.endDate + '-01'),
                },
            });
            return { isSuccess: true, message: 'education created', statusCode: 201 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readAllByUserId(): Promise<ReadAllEducationsResponse> {
        try {
            const educations = await prisma.education.findMany({
                where: { userId },
                orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
            });
            return { isSuccess: true, message: 'all educations read', educations, statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async updateById(id: string, dto: UpdateEducationDto): Promise<ResponseBase> {
        try {
            const education = await prisma.education.findUnique({ where: { id } });
            if (!education) {
                return { isSuccess: false, message: 'education not found', statusCode: 404 };
            }

            const startDate = dto.startDate ?? education.startDate.toISOString().slice(0, 7);
            const endDate = dto.endDate ?? (education.endDate ? education.endDate.toISOString().slice(0, 7) : undefined);
            const isCurrent = dto.isCurrent ?? education.isCurrent;

            if (!isCurrent && endDate && endDate < startDate) {
                return { isSuccess: false, message: 'End date cannot be before start date', statusCode: 400 };
            }

            const { startDate: startDateDto, endDate: endDateDto, isCurrent: isCurrentDto, ...restOfDto } = dto;

            await prisma.education.update({
                where: { id },
                data: {
                    isCurrent,
                    startDate: startDateDto ? new Date(startDateDto + '-01') : education.startDate,
                    endDate: isCurrent ? null : endDateDto ? new Date(endDateDto + '-01') : education.endDate,
                    ...restOfDto,
                },
            });
            return { isSuccess: true, message: 'education updated', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async deleteById(id: string): Promise<ResponseBase> {
        try {
            const education = await prisma.education.findUnique({ where: { id } });
            if (!education) {
                return { isSuccess: false, message: 'education not found', statusCode: 404 };
            }

            await prisma.education.delete({ where: { id } });
            return { isSuccess: true, message: 'education deleted', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
