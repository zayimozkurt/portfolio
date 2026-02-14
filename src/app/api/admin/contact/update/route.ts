import { ContactService } from '@/services/contact.service';
import { UpdateContactDto } from '@/types/dto/contact/update-contact.dto';
import { validateDto } from '@/utils/validate-dto.util';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const validateDtoResponse = await validateDto(UpdateContactDto, reqBody);

    if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
        return NextResponse.json(validateDtoResponse);
    }

    const response = await ContactService.update(validateDtoResponse.body);

    return NextResponse.json(response);
}
