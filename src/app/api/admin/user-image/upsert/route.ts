import { UserImagePlace } from '@/enums/user-image-place.enum';
import { UserImageService } from '@/services/user-image.service';
import { UpsertUserImageDto } from '@/types/dto/user-image/upsert-user-image.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const formData = await req.formData();

    const dto: UpsertUserImageDto = {
        file: formData.get('file') as File,
        place: formData.get('place') as UserImagePlace,
    };

    const response = await UserImageService.upsert(dto);
    return NextResponse.json(response);
}
