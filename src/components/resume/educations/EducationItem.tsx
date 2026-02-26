'use client';

import { TimelineItemCard } from '@/components/resume/timeline/TimelineItemCard';
import { ExtendedEducationModel } from '@/types/db/extended-education.model';

export function EducationItem({
    education,
    isEditMode,
    onEdit,
    onDelete,
    onAttachSkillToggle,
    isLast = false,
    isSaving,
}: {
    education: ExtendedEducationModel;
    isEditMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onAttachSkillToggle?: (button: HTMLButtonElement) => void;
    isLast?: boolean;
    isSaving?: boolean;
}) {
    return (
        <TimelineItemCard
            isCurrent={education.isCurrent}
            startDate={education.startDate}
            endDate={education.endDate}
            isLast={isLast}
            isEditMode={isEditMode}
            onEdit={onEdit}
            onDelete={onDelete}
            isSaving={isSaving}
            title={
                education.degree
                    ? `${education.degree}${education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ''}`
                    : education.fieldOfStudy || 'Education'
            }
            subtitle={
                <div className="flex items-center gap-2 mt-1">
                    <svg
                        className="w-4 h-4 text-text-tertiary flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                    </svg>
                    <span className="text-text-tertiary font-medium">{education.school}</span>
                </div>
            }
            description={education.description}
            skills={education.skills}
            onAttachSkillToggle={isEditMode ? onAttachSkillToggle : undefined}
        />
    );
}
