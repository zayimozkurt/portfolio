import { PortfolioItemService } from '@/services/portfolio-item.service';
import { UpdatePortfolioItemDto } from '@/types/dto/portfolio-item/update-portfolio-item.dto';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;

    const responseBody: UpdatePortfolioItemDto = await req.json();

    const response = await PortfolioItemService.updateById(params.id, responseBody);

    return NextResponse.json(response);
}
