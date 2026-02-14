import { PortfolioItemService } from '@/services/portfolio-item.service';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const response = await PortfolioItemService.deleteById(params.id);
    return NextResponse.json(response);
}
