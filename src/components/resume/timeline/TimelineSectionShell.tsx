'use client';

import { Button } from '@/components/Button';
import { ButtonVariant } from '@/enums/button-variant.enum';
import React from 'react';

export function TimelineSectionShell({
    isAdmin,
    isEditMode,
    onToggleEditMode,
    children,
}: {
    isAdmin: boolean;
    isEditMode: boolean;
    onToggleEditMode: () => void;
    children: React.ReactNode;
}) {
    return (
        <>
            {isAdmin && !isEditMode && (
                <div className="absolute top-2 right-2 md:right-0">
                    <Button onClick={onToggleEditMode} variant={ButtonVariant.PRIMARY}>
                        Edit
                    </Button>
                </div>
            )}

            {isEditMode && (
                <div className="absolute top-2 right-2 md:right-0">
                    <Button onClick={onToggleEditMode} variant={ButtonVariant.SECONDARY}>
                        Done
                    </Button>
                </div>
            )}

            <div className="flex flex-col">{children}</div>
        </>
    );
}
