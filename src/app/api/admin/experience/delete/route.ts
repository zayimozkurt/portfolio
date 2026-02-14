import { ExperienceService } from '@/services/experience.service';
import { DeleteExperienceDto } from '@/types/dto/experience/delete-experience.dto';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    const reqBody = await req.json();

    const { id } = reqBody;

    const dto: DeleteExperienceDto = { id };

    const response = await ExperienceService.deleteById(dto);
    return NextResponse.json(response);
}
