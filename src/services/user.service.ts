import { jwtCookieSettings } from '@/constants/cookie-settings.constant';
import { userId } from '@/constants/user-id.constant';
import { SupabaseBucketName } from '@/enums/supabase-bucket-name.enum';
import { DecodedJwtPayload } from '@/types/decoded-jwt-payload.interface';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { UserSignInDto } from '@/types/dto/user/user-sign-in.dto';
import { UserSignUpDto } from '@/types/dto/user/user-sign-up.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ReadUserByIdResponse } from '@/types/response/user/read-user-by-id.response';
import { UserSignInResponse } from '@/types/response/user/user-sign-in.response';
import { supabase } from '@/utils/supabase-client';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
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
            const user = await prisma.user.findUnique({
                where: {
                    userName: userSignInDto.userName,
                },
            });
            if (!user) return { isSuccess: false, message: 'no user found associated with given username', statusCode: 404 };

            const isMatch = bcrypt.compareSync(userSignInDto.password, user.passwordHash);
            if (!isMatch) return { isSuccess: false, message: 'invalid password', statusCode: 401 };

            const jwtSecret = jwtCookieSettings.secret;
            const jwtExpiresIn = jwtCookieSettings.expiresIn;
            if (!jwtSecret || !jwtExpiresIn) return { isSuccess: false, message: 'secret is undefined', statusCode: 500 };
            const token = jsonwebtoken.sign({ userId: user.id }, jwtSecret, {
                expiresIn: jwtExpiresIn,
            });

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
            const decoded = jsonwebtoken.verify(jwt, jwtCookieSettings.secret!) as DecodedJwtPayload;
            if (!(decoded.userId === userId))
                return {
                    isSuccess: false,
                    message: 'userId is not matching',
                    statusCode: 403,
                };
            return { isSuccess: true, message: 'authorized', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readById(): Promise<ReadUserByIdResponse> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    skills: { orderBy: { order: 'asc' } },
                    userImages: true,
                    contacts: { orderBy: { order: 'asc' } },
                    experiences: {
                        orderBy: {
                            startDate: 'desc',
                        },
                    },
                    educations: {
                        orderBy: {
                            startDate: 'desc',
                        },
                    },
                    portfolioItems: { orderBy: { order: 'asc' } },
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

            const newStoragePath = `cv_${Date.now()}`;

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
}
