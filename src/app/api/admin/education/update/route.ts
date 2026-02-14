import { EducationService } from '@/services/education.service';
import { UpdateEducationDto } from '@/types/dto/education/update-education.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { id, school, degree, fieldOfStudy, description, isCurrent, startDate, endDate } = reqBody;

    const dto: UpdateEducationDto = {
        id,
        school,
        degree,
        fieldOfStudy,
        description,
        isCurrent,
        startDate,
        endDate,
    };

    const response = await EducationService.updateById(dto);
    return NextResponse.json(response);
}
