import RootBody from '@/components/RootBody';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import React from 'react';
import './globals.css';

// Sans is a pure system stack (Helvetica Neue) set directly in globals.css.
const jetBrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Portfolio',
    description: 'Personal portfolio website.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="w-full h-full" suppressHydrationWarning>
            <body className={`w-full h-full font-sans ${jetBrainsMono.variable} antialiased`}>
                <RootBody>{children}</RootBody>
            </body>
        </html>
    );
}
