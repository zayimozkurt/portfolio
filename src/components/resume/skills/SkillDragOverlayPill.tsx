import { SKILL_NAME_CHAR_LIMIT } from '@/constants/skill-name-char-limit.constant';
import { Skill } from '@/generated/client';
import { GripVertical } from 'lucide-react';

export function SkillDragOverlayPill({ activeSkill }: { activeSkill: Skill }
) {
    return (
        <span
            className={`
                px-1 py-0.5 sm:px-3 sm:py-1.5 bg-surface-tertiary text-text-secondary font-medium rounded-full border border-border-muted flex items-center gap-1.5 shadow-lg select-none
                text-xs ${activeSkill.name.length > SKILL_NAME_CHAR_LIMIT / 2 ? '' : 'sm:text-sm'}
            `}>
            <span className="text-text-muted -ml-1">
                <GripVertical size={14} />
            </span>

            <p className='max-w-[125px] sm:max-w-[175px] truncate'>{activeSkill.name}</p>
        </span>
    );
}
