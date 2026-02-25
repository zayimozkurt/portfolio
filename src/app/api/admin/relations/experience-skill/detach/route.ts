import { ExperienceSkillService } from '@/services/relations/experience-skill.service';
import { AttachOrDetachExperienceSkillDto } from '@/types/dto/relations/experience-skill/attach-experience-skill.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(AttachOrDetachExperienceSkillDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse, { status: validateDtoResponse.statusCode });
        }

        const response = await ExperienceSkillService.detach(validateDtoResponse.body);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = {
            isSuccess: false,
            message: 'internal server error',
            statusCode: 500,
        };

        return NextResponse.json(response, { status: 500 });
    }
}
