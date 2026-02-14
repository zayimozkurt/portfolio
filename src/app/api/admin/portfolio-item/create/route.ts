import { PortfolioItemService } from '@/services/portfolio-item.service';
import { CreatePortfolioItemDto } from '@/types/dto/portfolio-item/create-portfolio-item.dto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const responseBody: CreatePortfolioItemDto = await req.json();
    const response = await PortfolioItemService.create(responseBody);
    return NextResponse.json(response);
}
