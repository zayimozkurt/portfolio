import { jwtCookieSettings } from '@/constants/cookie-settings.constant';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieOptions: Partial<ResponseCookie> = {
        maxAge: jwtCookieSettings.expiresIn, // this expires the cookie immediately
        secure: jwtCookieSettings.isSecure,
        httpOnly: jwtCookieSettings.isHttpOnly,
        sameSite: jwtCookieSettings.sameSite,
        path: '/', // important: must match the path used when setting
    };

    const cookieStore = await cookies();
    cookieStore.set('jwt', '', cookieOptions);

    return NextResponse.json({
        isSuccess: true,
        message: 'signed out',
    });
}
