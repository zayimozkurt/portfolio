'use client';

import { Button } from '@/components/Button';
import { DESCRIPTION_CHAR_LIMIT } from '@/constants/description-char-limit.constant';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { Education } from '@/generated/client';
import { calculateDuration } from '@/utils/calculate-duration.util';
import { useState } from 'react';

export function EducationItem({
    education,
    isEditMode,
    onEdit,
    onDelete,
    isLast = false,
    isSaving,
}: {
    education: Education;
    isEditMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
    isLast?: boolean;
    isSaving?: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const endDate = education.isCurrent ? new Date() : new Date(education.endDate!);
    const duration = calculateDuration(education.startDate, endDate);
    const startDateFormatted = new Date(education.startDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
    const endDateFormatted = education.isCurrent
        ? 'Present'
        : new Date(education.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const shouldTruncate = education.description && education.description.length > DESCRIPTION_CHAR_LIMIT;
    const displayDescription =
        shouldTruncate && !isExpanded ? education.description!.slice(0, DESCRIPTION_CHAR_LIMIT) : education.description;

    return (
        <div className="relative flex gap-4 md:gap-6">
            <div className="flex flex-col items-center">
                <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        education.isCurrent ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-400'
                    }`}
                />
                {!isLast && <div className="w-0.5 h-full bg-gray-300 -mb-4" />}
            </div>

            <div className="flex-1 pb-8">
                <div
                    className={`p-4 md:p-5 rounded-lg border transition-shadow ${
                        education.isCurrent
                            ? 'bg-gray-50 border-gray-300 shadow-md hover:shadow-lg'
                            : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {education.degree
                                    ? `${education.degree}${education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ''}`
                                    : education.fieldOfStudy || 'Education'}
                            </h3>
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
                                        d="M12 14l9-5-9-5-9 5 9 5z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    />
                                </svg>
                                <span className="text-gray-600 font-medium">{education.school}</span>
                            </div>
                        </div>

                        {education.isCurrent && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white self-start">
                                Current
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-500">
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
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <div className="flex items-center gap-1.5 text-gray-500">
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

                    {education.description && (
                        <div className="mt-3">
                            <p className="text-gray-600 text-sm leading-relaxed inline whitespace-pre-wrap">
                                {displayDescription}
                                {shouldTruncate && !isExpanded && (
                                    <Button
                                        onClick={() => setIsExpanded(true)}
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
                            {shouldTruncate && isExpanded && (
                                <Button
                                    onClick={() => setIsExpanded(false)}
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

                    {isEditMode && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                            <Button onClick={onEdit} variant={ButtonVariant.PRIMARY}>
                                Edit
                            </Button>
                            <Button variant={ButtonVariant.DANGER} onClick={onDelete} disabled={isSaving}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
