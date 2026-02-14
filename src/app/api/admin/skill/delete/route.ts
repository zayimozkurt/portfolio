import { SkillService } from '@/services/skill.service';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    const reqBody = await req.json();

    const { id } = reqBody;

    const response = await SkillService.deleteById(id);
    return NextResponse.json(response);
}
