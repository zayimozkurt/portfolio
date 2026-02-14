import { SkillService } from '@/services/skill.service';
import { CreateSkillDto } from '@/types/dto/skill/create-skill.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const reqBody = await req.json();

    const { name } = reqBody;

    const dto: CreateSkillDto = { name };

    const response = await SkillService.create(dto);
    return NextResponse.json(response);
}
