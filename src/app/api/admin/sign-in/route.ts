import { jwtCookieSettings } from '@/constants/cookie-settings.constant';
import { UserService } from '@/services/user.service';
import { UserSignInDto } from '@/types/dto/user/user-sign-in.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const reqBody: UserSignInDto = await req.json();

    const response = await UserService.signIn(reqBody);
    if (!response.isSuccess || !response.jwt) return Response.json(response);

    const cookieOptions: Partial<ResponseCookie> = {
        maxAge: jwtCookieSettings.expiresIn,
        secure: jwtCookieSettings.isSecure,
        httpOnly: jwtCookieSettings.isHttpOnly,
        sameSite: jwtCookieSettings.sameSite
    };
    // add validation here to validate cookie options
    const cookieStore = await cookies();
    cookieStore.set('jwt', response.jwt, cookieOptions);

    const responseBase: ResponseBase = {
        isSuccess: response.isSuccess,
        message: response.message,
    };

    return NextResponse.json(responseBase);
}
