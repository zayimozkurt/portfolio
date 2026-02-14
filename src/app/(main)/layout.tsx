'use server';

import LayoutClient from '@/app/(main)/layout-client';
import { UserService } from '@/services/user.service';
import { cookies } from 'next/headers';
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const extractedCookies = await cookies();
    const jwt = extractedCookies.get('jwt')?.value;
    const authorizationResponse = UserService.authorize(jwt);

    return <LayoutClient isAuthorized={authorizationResponse.isSuccess}>{children}</LayoutClient>;
}
