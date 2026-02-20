import { PortfolioItemSkillService } from '@/services/relations/portfolio-item-skill.service';
import { AttachOrDetachPortfolioItemSkillDto } from '@/types/dto/relations/portfolio-item-skill/attach-portfolio-item-skill.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(AttachOrDetachPortfolioItemSkillDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse);
        }

        const response = await PortfolioItemSkillService.attach(validateDtoResponse.body);

        return NextResponse.json(response);
    } catch (error) {
        const response: ResponseBase = {
            isSuccess: false,
            message: 'internal server error'
        };

        return NextResponse.json(response);
    }
}
