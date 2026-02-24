import { PortfolioItemService } from '@/services/portfolio-item.service';
import { CleanUpOrphanedPortfolioImagesDto } from '@/types/dto/portfolio-item/clean-up-orphaned-portfolio-images.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(CleanUpOrphanedPortfolioImagesDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse, { status: validateDtoResponse.statusCode });
        }

        const response = await PortfolioItemService.cleanUpOrphanedImagesFromContent(validateDtoResponse.body);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        console.error(error);
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
