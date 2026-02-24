import { PortfolioItemService } from '@/services/portfolio-item.service';
import { ReorderPortfolioItemsDto } from '@/types/dto/portfolio-item/reorder-portfolio-items.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(ReorderPortfolioItemsDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse, { status: validateDtoResponse.statusCode });
        }

        const response = await PortfolioItemService.reorder(validateDtoResponse.body);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
