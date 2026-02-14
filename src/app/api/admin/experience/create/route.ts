import { ExperienceService } from '@/services/experience.service';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const reqBody = await req.json();

    const { title, company, isCurrent, startDate, endDate, description } = reqBody;

    const dto: CreateExperienceDto = {
        title,
        company,
        isCurrent,
        startDate,
        endDate,
        description,
    };

    const response = await ExperienceService.create(dto);
    return NextResponse.json(response);
}
