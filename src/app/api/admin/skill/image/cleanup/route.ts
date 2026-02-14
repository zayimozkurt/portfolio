import { SkillService } from '@/services/skill.service';
import { CleanUpOrphanedSkillImagesDto } from '@/types/dto/skill/clean-up-orphaned-skill-images.dto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const reqBody = await req.json();

    const { skillId, content } = reqBody;

    const dto: CleanUpOrphanedSkillImagesDto = {
        skillId,
        content,
    };

    const response = await SkillService.cleanUpOrphanedImages(dto);

    return NextResponse.json(response);
}
