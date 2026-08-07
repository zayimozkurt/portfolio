'use client';

import { makeStore, RootState } from '@/store/store';
import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { Provider } from 'react-redux';

export default function RootBody({
    children,
    preloadedState,
}: {
    children: React.ReactNode;
    preloadedState?: Partial<RootState>;
}) {
    const [store] = useState(() => makeStore(preloadedState));

    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div className="w-full h-full">{children}</div>
            </ThemeProvider>
        </Provider>
    );
}
