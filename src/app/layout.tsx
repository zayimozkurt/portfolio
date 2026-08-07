import RootBody from '@/components/RootBody';
import { UserService } from '@/services/user.service';
import { RootState } from '@/store/store';
import { SerializedUserModel } from '@/types/db/extended-user.model';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetched here rather than in the browser: the server already has a database
    // connection, so doing it client-side would mean shipping HTML, hydrating,
    // and only then starting the round trip.
    const [extractedCookies, readUserResponse] = await Promise.all([cookies(), UserService.readById()]);

    const isAdmin = UserService.authorize(extractedCookies.get('jwt')?.value).isSuccess;

    // Round-tripped through JSON so the store receives exactly what
    // /api/visitor/user/read would return — Dates as ISO strings. Handing the raw
    // Prisma result over would seed the store with live Date objects, which Redux
    // flags as non-serializable and which a later refresh would silently replace
    // with strings.
    const preloadedState: Partial<RootState> = {
        isAdmin,
        ...(readUserResponse.user
            ? { user: JSON.parse(JSON.stringify(readUserResponse.user)) as SerializedUserModel }
            : {}),
    };

    return (
        <html lang="en" className="w-full h-full" suppressHydrationWarning>
            <body className={`w-full h-full font-sans ${jetBrainsMono.variable} antialiased`}>
                <RootBody preloadedState={preloadedState}>{children}</RootBody>
            </body>
        </html>
    );
}
