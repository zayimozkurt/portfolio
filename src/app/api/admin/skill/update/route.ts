import { SkillService } from '@/services/skill.service';
import { UpdateSkillDto } from '@/types/dto/skill/update-skill.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { id, name, content } = reqBody;

    const dto: UpdateSkillDto = { id, name, content };

    const response = await SkillService.updateById(dto);
    return NextResponse.json(response);
}
