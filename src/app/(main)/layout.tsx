import LayoutClient from '@/app/(main)/layout-client';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <LayoutClient>{children}</LayoutClient>;
}
