import { PortfolioItemService } from '@/services/portfolio-item.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const response = await PortfolioItemService.readAllExtendedByUserId();

    return NextResponse.json(response, { status: response.statusCode });
}
