import { EducationService } from '@/services/education.service';
import { CreateEducationDto } from '@/types/dto/education/create-education.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const reqBody = await req.json();

    const { school, degree, fieldOfStudy, description, isCurrent, startDate, endDate } = reqBody;

    const dto: CreateEducationDto = {
        school,
        degree,
        fieldOfStudy,
        description,
        isCurrent,
        startDate,
        endDate,
    };

    const response = await EducationService.create(dto);
    return NextResponse.json(response);
}
