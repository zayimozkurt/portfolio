import { UserImageService } from '@/services/user-image.service';
import { DeleteUserImageDto } from '@/types/dto/user-image/delete-user-image.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(DeleteUserImageDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse, { status: validateDtoResponse.statusCode });
        }

        const response = await UserImageService.delete(validateDtoResponse.body);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
