'use server';

import PageClient from '@/app/(main)/skill/[id]/page-client';
import { SkillService } from '@/services/skill.service';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const readSingleSkillResponse = await SkillService.readById(id);

    return (
        <div className="w-full h-full flex justify-center items-start">
            <div className="w-[325px] sm:w-[700px] h-full">
                {readSingleSkillResponse.isSuccess && readSingleSkillResponse.skill ? (
                    <PageClient skill={readSingleSkillResponse.skill} />
                ) : (
                    <div>Skill not found</div>
                )}
            </div>
        </div>
    );
}
