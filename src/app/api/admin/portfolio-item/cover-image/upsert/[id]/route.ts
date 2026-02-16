import { PortfolioItemService } from '@/services/portfolio-item.service';
import { ResponseBase } from '@/types/response/response-base';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;

        const formData = await req.formData();

        const file = formData.get('file');

        const response = await PortfolioItemService.upsertCoverImage(params.id, file);
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const response: ResponseBase = {
            isSuccess: false,
            message: 'internal server error'
        };
        return NextResponse.json(response);
    }
}
