import { ContactService } from '@/services/contact.service';
import { DeleteContactDto } from '@/types/dto/contact/delete-contact.dto';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    const reqBody = await req.json();

    const { id } = reqBody;

    const dto: DeleteContactDto = { id };

    const response = await ContactService.delete(dto);
    return NextResponse.json(response);
}
