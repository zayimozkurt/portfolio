import { PortfolioItemService } from '@/services/portfolio-item.service';
import { UploadPortfolioItemImageDto } from '@/types/dto/portfolio-item/upload-portfolio-item-image.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const formData = await req.formData();

    const dto: UploadPortfolioItemImageDto = {
        file: formData.get('file') as File,
        portfolioItemId: formData.get('portfolioItemId') as string,
    };

    const response = await PortfolioItemService.uploadImage(dto);
    return NextResponse.json(response);
}
