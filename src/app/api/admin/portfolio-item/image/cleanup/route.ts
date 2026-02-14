import { PortfolioItemService } from '@/services/portfolio-item.service';
import { CleanUpOrphanedPortfolioImagesDto } from '@/types/dto/portfolio-item/clean-up-orphaned-portfolio-images.dto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const reqBody = await req.json();

    const { portfolioItemId, content } = reqBody;

    const dto: CleanUpOrphanedPortfolioImagesDto = {
        portfolioItemId,
        content,
    };

    const response = await PortfolioItemService.cleanUpOrphanedImages(dto);

    return NextResponse.json(response);
}
