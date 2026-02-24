import { PortfolioItemService } from '@/services/portfolio-item.service';
import { UpdatePortfolioItemDto } from '@/types/dto/portfolio-item/update-portfolio-item.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(UpdatePortfolioItemDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse, { status: validateDtoResponse.statusCode });
        }

        const response = await PortfolioItemService.updateById(id, validateDtoResponse.body);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
