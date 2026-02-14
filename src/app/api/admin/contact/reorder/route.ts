import { ContactService } from '@/services/contact.service';
import { ReorderContactsDto } from '@/types/dto/contact/reorder-contacts.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { orderedIds } = reqBody;

    const dto: ReorderContactsDto = { orderedIds };

    const response = await ContactService.reorder(dto);
    return NextResponse.json(response);
}
