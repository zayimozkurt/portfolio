import { SkillService } from '@/services/skill.service';
import { ReorderSkillsDto } from '@/types/dto/skill/reorder-skills.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(ReorderSkillsDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse, { status: validateDtoResponse.statusCode });
        }

        const response = await SkillService.reorder(validateDtoResponse.body);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
