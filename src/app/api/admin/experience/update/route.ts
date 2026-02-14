import { ExperienceService } from '@/services/experience.service';
import { UpdateExperienceDto } from '@/types/dto/experience/update-experience.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { id, title, company, isCurrent, startDate, endDate, description } = reqBody;

    const dto: UpdateExperienceDto = {
        id,
        title,
        company,
        isCurrent,
        startDate,
        endDate,
        description,
    };

    const response = await ExperienceService.updateById(dto);
    return NextResponse.json(response);
}
