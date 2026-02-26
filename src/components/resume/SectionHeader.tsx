'use client';

import React from 'react';

export function SectionHeader({ title }: { title: string | React.ReactNode }) {
    return (
        <div className="w-full flex justify-between items-center gap-6">
            <div className="text-xl font-bold whitespace-nowrap flex gap-2 justify-start items-center">{title}</div>
            <span className="w-full h-[2px] rounded-full bg-border-theme"></span>
        </div>
    );
}
