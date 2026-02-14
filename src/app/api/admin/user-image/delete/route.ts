import { UserImageService } from '@/services/user-image.service';
import { DeleteUserImageDto } from '@/types/dto/user-image/delete-user-image.dto';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    const reqBody: DeleteUserImageDto = await req.json();

    const response = await UserImageService.delete(reqBody);
    return NextResponse.json(response);
}
