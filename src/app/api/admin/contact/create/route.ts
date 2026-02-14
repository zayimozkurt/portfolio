import { ContactService } from '@/services/contact.service';
import { CreateContactDto } from '@/types/dto/contact/create-contact.dto';
import { validateDto } from '@/utils/validate-dto.util';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const reqBody = await req.json();

    const validateDtoResponse = await validateDto(CreateContactDto, reqBody);

    if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
        return NextResponse.json(validateDtoResponse);
    }

    const response = await ContactService.create(validateDtoResponse.body);

    return NextResponse.json(response);
}
