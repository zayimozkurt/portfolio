'use client';

import AssociatedItemsRow from '@/components/AssociatedItemsRow';
import { Button } from '@/components/Button';
import { DESCRIPTION_CHAR_LIMIT } from '@/constants/description-char-limit.constant';
import { AssociatedItemsRowSize } from '@/enums/associated-items-row-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { Skill } from '@/generated/client';
import { calculateDuration } from '@/utils/calculate-duration.util';
import React, { useState } from 'react';

export function TimelineItemCard({
    isCurrent,
    isLast = false,
    isEditMode,
    onEdit,
    onDelete,
    isSaving,
    startDate,
    endDate,
    title,
    subtitle,
    description,
    skills,
    onAttachSkillToggle,
}: {
    isCurrent: boolean;
    isLast?: boolean;
    isEditMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
    isSaving?: boolean;
    startDate: Date | string;
    endDate?: Date | string | null;
    title: React.ReactNode;
    subtitle: React.ReactNode;
    description?: string | null;
    skills?: Skill[];
    onAttachSkillToggle?: (button: HTMLButtonElement) => void;
}) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const resolvedEndDate = isCurrent ? new Date() : new Date(endDate!);
    const duration = calculateDuration(new Date(startDate), resolvedEndDate);
    const startDateFormatted = new Date(startDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
    const endDateFormatted = isCurrent
        ? 'Present'
        : new Date(endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const shouldTruncate = description && description.length > DESCRIPTION_CHAR_LIMIT;
    const displayDescription =
        shouldTruncate && !isDescriptionExpanded ? description!.slice(0, DESCRIPTION_CHAR_LIMIT) : description;

    return (
        <div className="relative flex gap-4 md:gap-6">
            <div className="flex flex-col items-center">
                <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        isCurrent ? 'bg-text-secondary border-text-secondary' : 'bg-surface border-text-muted'
                    }`}
                />
                {!isLast && <div className="w-0.5 h-full bg-border-muted -mb-4" />}
            </div>

            <div className="flex-1 min-w-0 pb-8">
                <div
                    className={`p-4 md:p-5 rounded-lg border transition-shadow ${
                        isCurrent
                            ? 'bg-surface-secondary border-border-muted shadow-md hover:shadow-lg'
                            : 'bg-surface border-border-muted shadow-sm hover:shadow-md'
                    }`}
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                            {subtitle}
                        </div>

                        {isCurrent && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-btn-primary-bg text-btn-primary-text self-start">
                                Current
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm">
                        <div className="flex items-center gap-1.5 text-text-tertiary">
                            <svg
                                className="w-4 h-4 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span>
                                {startDateFormatted} - {endDateFormatted}
                            </span>
                        </div>
                        <span className="text-border-muted hidden sm:inline">|</span>
                        <div className="flex items-center gap-1.5 text-text-tertiary">
                            <svg
                                className="w-4 h-4 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{duration}</span>
                        </div>
                    </div>

                    {description && (
                        <div className="mt-3">
                            <p className="text-text-tertiary text-sm leading-relaxed inline whitespace-pre-wrap">
                                {displayDescription}
                                {shouldTruncate && !isDescriptionExpanded && (
                                    <Button
                                        onClick={() => setIsDescriptionExpanded(true)}
                                        variant={ButtonVariant.LINK}
                                        className="cursor-pointer inline-flex items-center ml-1 font-medium"
                                    >
                                        <span className="tracking-wider">...</span>
                                        <svg
                                            className="w-4 h-4 ml-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </Button>
                                )}
                            </p>
                            {shouldTruncate && isDescriptionExpanded && (
                                <Button
                                    onClick={() => setIsDescriptionExpanded(false)}
                                    variant={ButtonVariant.LINK}
                                    className="cursor-pointer flex items-center mt-2 text-sm font-medium"
                                >
                                    <span>Show less</span>
                                    <svg
                                        className="w-4 h-4 ml-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 15l7-7 7 7"
                                        />
                                    </svg>
                                </Button>
                            )}
                        </div>
                    )}

                    {skills && skills.length > 0 && !isEditMode && (
                        <div className="mt-3">
                            <AssociatedItemsRow
                                title="Skills"
                                items={skills.map(skill => ({ id: skill.id, label: skill.name, href: `/skill/${skill.id}` }))}
                                size={AssociatedItemsRowSize.SMALL}
                                hideTitle
                                openInNewTab
                            />
                        </div>
                    )}

                    {isEditMode && (
                        <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-border-muted">
                            <div className='flex gap-2 justify-start items-center'>
                                <Button onClick={onEdit} variant={ButtonVariant.PRIMARY}>
                                    Edit
                                </Button>

                                <Button variant={ButtonVariant.DANGER} onClick={onDelete} disabled={isSaving}>
                                    Delete
                                </Button>
                            </div>

                            <div>
                                {onAttachSkillToggle && (
                                    <Button
                                        onClick={event => onAttachSkillToggle(event.currentTarget)}
                                        variant={ButtonVariant.SECONDARY}
                                    >
                                        Attach/Detach Skill
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
