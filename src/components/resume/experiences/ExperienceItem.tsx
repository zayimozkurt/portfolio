'use client';

import { TimelineItemCard } from '@/components/resume/timeline/TimelineItemCard';
import { ExtendedExperienceModel } from '@/types/db/extended-experience.model';

export function ExperienceItem({
    experience,
    isEditMode,
    onEdit,
    onDelete,
    onAttachSkillToggle,
    isLast = false,
    isSaving,
}: {
    experience: ExtendedExperienceModel;
    isEditMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onAttachSkillToggle?: (button: HTMLButtonElement) => void;
    isLast?: boolean;
    isSaving?: boolean;
}) {
    return (
        <TimelineItemCard
            isCurrent={experience.isCurrent}
            startDate={experience.startDate}
            endDate={experience.endDate}
            isLast={isLast}
            isEditMode={isEditMode}
            onEdit={onEdit}
            onDelete={onDelete}
            isSaving={isSaving}
            title={experience.title}
            subtitle={
                <div className="flex items-center gap-2 mt-1">
                    <svg
                        className="w-4 h-4 text-gray-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                    <span className="text-gray-600 font-medium">{experience.company}</span>
                </div>
            }
            description={experience.description}
            skills={experience.skills}
            onAttachSkillToggle={isEditMode ? onAttachSkillToggle : undefined}
        />
    );
}
