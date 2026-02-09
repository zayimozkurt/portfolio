export const jwtCookieSettings = {
    secret: process.env.JWT_SECRET,
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
    isSecure: process.env.NODE_ENV === 'production' ? true : false,
    isHttpOnly: true,
    sameSite: 'lax' as 'lax' | 'strict' | 'none',
};
