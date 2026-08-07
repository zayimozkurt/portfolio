import { renderResumePdf } from '@/components/resume-pdf/render-resume-pdf';
import { jwtCookieSettings } from '@/constants/cookie-settings.constant';
import { getSignInLockoutMinutes } from '@/constants/sign-in-lockout.constant';
import { SupabaseBucketName } from '@/enums/supabase-bucket-name.enum';
import { DecodedJwtPayload } from '@/types/decoded-jwt-payload.interface';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { UserSignInDto } from '@/types/dto/user/user-sign-in.dto';
import { UserSignUpDto } from '@/types/dto/user/user-sign-up.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ReadUserByIdResponse } from '@/types/response/user/read-user-by-id.response';
import { UserSignInResponse } from '@/types/response/user/user-sign-in.response';
import { getUserId } from '@/utils/get-user-id.util';
import { supabase } from '@/utils/supabase-client';
import bcrypt from 'bcrypt';
import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken';
import { prisma } from 'prisma/prisma-client';

export class UserService {
    private constructor() {}

    static async signUp(userSignInDto: UserSignUpDto): Promise<ResponseBase> {
        try {
            const { password, ...restOfDto } = userSignInDto;
            const passwordHash = bcrypt.hashSync(password, 10);
            await prisma.user.create({
                data: {
                    ...restOfDto,
                    passwordHash,
                },
            });
            return { isSuccess: true, message: 'success', statusCode: 201 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async signIn(userSignInDto: UserSignInDto): Promise<UserSignInResponse> {
        try {
            // Single-tenant: the password alone identifies the one account, so
            // there is no username to look up.
            const user = await prisma.user.findFirst();
            if (!user) return { isSuccess: false, message: 'no user found', statusCode: 404 };

            const now = new Date();

            if (user.lockedUntil && user.lockedUntil > now) {
                const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 60_000);
                return {
                    isSuccess: false,
                    message: `Too many failed attempts. Try again in ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}.`,
                    statusCode: 429,
                };
            }

            const isMatch = await bcrypt.compare(userSignInDto.password, user.passwordHash);

            if (!isMatch) {
                // The count deliberately survives an expired lockout — resetting it
                // there would hand an attacker a fresh batch of free guesses every
                // time one elapsed. Only a correct password clears it.
                const failedSignInAttempts = user.failedSignInAttempts + 1;
                const lockoutMinutes = getSignInLockoutMinutes(failedSignInAttempts);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failedSignInAttempts,
                        lockedUntil: lockoutMinutes > 0 ? new Date(now.getTime() + lockoutMinutes * 60_000) : null,
                    },
                });

                if (lockoutMinutes > 0) {
                    return {
                        isSuccess: false,
                        message: `Invalid password. Too many failed attempts — try again in ${lockoutMinutes} minute${lockoutMinutes === 1 ? '' : 's'}.`,
                        statusCode: 429,
                    };
                }

                return { isSuccess: false, message: 'invalid password', statusCode: 401 };
            }

            const jwtSecret = jwtCookieSettings.secret;
            const jwtExpiresIn = jwtCookieSettings.expiresIn;
            if (!jwtSecret || !jwtExpiresIn) return { isSuccess: false, message: 'secret is undefined', statusCode: 500 };
            const token = jsonwebtoken.sign({ userId: user.id }, jwtSecret, {
                expiresIn: jwtExpiresIn,
            });

            if (user.failedSignInAttempts !== 0 || user.lockedUntil !== null) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { failedSignInAttempts: 0, lockedUntil: null },
                });
            }

            return { isSuccess: true, message: 'signed in', jwt: token, statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static authorize(jwt: string | undefined): ResponseBase {
        if (!jwt)
            return {
                isSuccess: false,
                message: 'Authorization failed.',
                statusCode: 401,
            };

        try {
            // Single-tenant: signIn only ever issues a signed token to the one user
            // in the database, so a valid signature is sufficient proof. Kept
            // synchronous (no db call) so the proxy can run on any runtime.
            const decoded = jsonwebtoken.verify(jwt, jwtCookieSettings.secret!) as DecodedJwtPayload;

            if (!decoded.userId)
                return {
                    isSuccess: false,
                    message: 'token is missing a userId',
                    statusCode: 403,
                };

            return { isSuccess: true, message: 'authorized', statusCode: 200 };
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                return {
                    isSuccess: false,
                    message: error.message,
                    statusCode: 401
                };
            }

            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readById(): Promise<ReadUserByIdResponse> {
        try {
            const userId = await getUserId();

            const user = await prisma.user.findUnique({
                // Without this every include below becomes its own round trip to the
                // database (11 in total, ~1.9s). 'join' collapses them into one query.
                relationLoadStrategy: 'join',
                where: {
                    id: userId,
                },
                // Never leave the server: the hash, and the sign-in throttling
                // state that would tell an attacker how close a lockout is.
                omit: { passwordHash: true, failedSignInAttempts: true, lockedUntil: true },
                include: {
                    skills: { orderBy: { order: 'asc' } },
                    userImages: true,
                    contacts: { orderBy: { order: 'asc' } },
                    experiences: {
                        orderBy: {
                            startDate: 'desc',
                        },
                        include: { skills: { orderBy: { order: 'asc' } } },
                    },
                    educations: {
                        orderBy: {
                            startDate: 'desc',
                        },
                        include: { skills: { orderBy: { order: 'asc' } } },
                    },
                    portfolioItems: { orderBy: { order: 'asc' }, include: { skills: { orderBy: { order: 'asc' } } } },
                },
            });

            if (!user) {
                return { isSuccess: false, message: 'no user found', statusCode: 404 };
            }

            return {
                isSuccess: true,
                message: 'user read',
                user,
                statusCode: 200,
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async update(updateUserDto: UpdateUserDto): Promise<ResponseBase> {
        let passwordHash = '';
        if (updateUserDto.password && updateUserDto.password.length !== 0) {
            passwordHash = bcrypt.hashSync(updateUserDto.password, 10);
            delete updateUserDto.password;
        }

        try {
            const userId = await getUserId();

            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    ...updateUserDto,
                    ...(passwordHash.length !== 0 && { passwordHash }),
                },
            });
            return { isSuccess: true, message: 'user updated', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async upsertCv(file: File): Promise<ResponseBase> {
        try {
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            const readUserByIdResponse = await this.readById();
            if (!readUserByIdResponse.isSuccess || !readUserByIdResponse.user)
                throw new Error(readUserByIdResponse.message);

            const existingCvUrl = readUserByIdResponse.user.cvUrl;

            const newStoragePath = `cv_${Date.now()}.pdf`;

            const supabaseUploadResponse = await supabase.storage
                .from(SupabaseBucketName.CV)
                .upload(newStoragePath, fileBuffer, { contentType: file.type });

            if (supabaseUploadResponse.error) {
                console.error(supabaseUploadResponse.error);
                return {
                    isSuccess: false,
                    message: 'error while uploading to supabase',
                    statusCode: 500,
                };
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(SupabaseBucketName.CV).getPublicUrl(newStoragePath);

            const updateUserResponse = await this.update({
                cvUrl: publicUrl,
            } as UpdateUserDto);
            if (!updateUserResponse.isSuccess) {
                const supabaseResponse = await supabase.storage.from(SupabaseBucketName.CV).remove([newStoragePath]);

                if (supabaseResponse.error)
                    console.error(supabaseResponse.error);

                return updateUserResponse;
            }

            if (existingCvUrl && existingCvUrl.length !== 0) {
                const oldFileName = existingCvUrl.split('/').pop()?.split('?')[0];

                if (oldFileName) {
                    const { error } = await supabase.storage.from(SupabaseBucketName.CV).remove([oldFileName]);

                    if (error) console.error(error);
                }
            }

            return { isSuccess: true, message: 'cv uploaded', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async deleteCv(): Promise<ResponseBase> {
        try {
            const readUserByIdResponse = await this.readById();
            if (!readUserByIdResponse.isSuccess || !readUserByIdResponse.user)
                throw new Error(readUserByIdResponse.message);

            const existingCvUrl = readUserByIdResponse.user.cvUrl;

            if (!existingCvUrl) {
                return { isSuccess: true, message: "there already isn't a cv", statusCode: 200 };
            }

            const updateUserResponse = await this.update({
                cvUrl: null,
            } as UpdateUserDto);
            if (!updateUserResponse.isSuccess) {
                throw new Error(updateUserResponse.message);
            }

            const fileName = existingCvUrl.split('/').pop()?.split('?')[0];

            if (fileName) {
                const { error } = await supabase.storage.from(SupabaseBucketName.CV).remove([fileName]);

                if (error) console.error(error);
            }

            return { isSuccess: true, message: 'cv deleted', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async generateCv(): Promise<ResponseBase> {
        try {
            const readUserByIdResponse = await this.readById();
            if (!readUserByIdResponse.isSuccess || !readUserByIdResponse.user)
                throw new Error(readUserByIdResponse.message);

            const user = readUserByIdResponse.user;
            const existingCvUrl = user.cvUrl;

            const fileBuffer = await renderResumePdf(user);

            const newStoragePath = `cv_${Date.now()}.pdf`;

            const supabaseUploadResponse = await supabase.storage
                .from(SupabaseBucketName.CV)
                .upload(newStoragePath, fileBuffer, { contentType: 'application/pdf' });

            if (supabaseUploadResponse.error) {
                console.error(supabaseUploadResponse.error);
                return {
                    isSuccess: false,
                    message: 'error while uploading to supabase',
                    statusCode: 500,
                };
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(SupabaseBucketName.CV).getPublicUrl(newStoragePath);

            const updateUserResponse = await this.update({
                cvUrl: publicUrl,
            } as UpdateUserDto);
            if (!updateUserResponse.isSuccess) {
                const supabaseResponse = await supabase.storage.from(SupabaseBucketName.CV).remove([newStoragePath]);

                if (supabaseResponse.error)
                    console.error(supabaseResponse.error);

                return updateUserResponse;
            }

            if (existingCvUrl && existingCvUrl.length !== 0) {
                const oldFileName = existingCvUrl.split('/').pop()?.split('?')[0];

                if (oldFileName) {
                    const { error } = await supabase.storage.from(SupabaseBucketName.CV).remove([oldFileName]);

                    if (error) console.error(error);
                }
            }

            return { isSuccess: true, message: 'cv generated', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
