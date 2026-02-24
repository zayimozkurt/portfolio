import { UserImageService } from '@/services/user-image.service';
import { UpsertUserImageDto } from '@/types/dto/user-image/upsert-user-image.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get('file');

        if (!file || !(file instanceof File))
            return NextResponse.json({ isSuccess: false, message: "file doesn't exist", statusCode: 400 }, { status: 400 });
        if (!file.type.startsWith('image/'))
            return NextResponse.json({ isSuccess: false, message: 'file must be an image', statusCode: 400 }, { status: 400 });

        const validateDtoResponse = await validateDto(UpsertUserImageDto, { place: formData.get('place') });
        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body)
            return NextResponse.json(validateDtoResponse, { status: validateDtoResponse.statusCode });

        const response = await UserImageService.upsert(file, validateDtoResponse.body);

        return NextResponse.json(response, { status: response.statusCode });
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error', statusCode: 500 };
        return NextResponse.json(response, { status: 500 });
    }
}
