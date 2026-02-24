import { PortfolioItemService } from '@/services/portfolio-item.service';
import { ResponseBase } from '@/types/response/response-base';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const response = await PortfolioItemService.deleteById(id);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
