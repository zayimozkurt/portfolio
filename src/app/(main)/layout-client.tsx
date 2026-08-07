'use client';

import NavBar from '@/components/NavBar';
import { ADMIN_NAVBAR_HEIGHT } from '@/constants/navbar-height/admin-navbar-height.constant';
import { VISITOR_NAVBAR_HEIGHT } from '@/constants/navbar-height/visitor-navbar-height.constant';
import { useAppSelector } from '@/store/hooks';
import React from 'react';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    // The store is already seeded by the root layout, so there is nothing to wait
    // for here — children render on the first paint.
    const isAdmin = useAppSelector((state) => state.isAdmin);

    return (
        <div className="w-full h-full flex flex-col justify-start items-center">
            <NavBar />
            <div className="w-full h-full p-4" style={{ paddingTop: isAdmin ? ADMIN_NAVBAR_HEIGHT : VISITOR_NAVBAR_HEIGHT }}>
                {children}
            </div>
        </div>
    );
}
