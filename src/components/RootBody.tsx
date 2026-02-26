'use client';

import store from '@/store/store';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { Provider } from 'react-redux';

export default function RootBody({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div className="w-full h-full">{children}</div>
            </ThemeProvider>
        </Provider>
    );
}
