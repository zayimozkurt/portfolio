import { userId } from '@/constants/user-id.constant';
import { SupabaseBucketName } from '@/enums/supabase-bucket-name.enum';
import { DeleteUserImageDto } from '@/types/dto/user-image/delete-user-image.dto';
import { UpsertUserImageDto } from '@/types/dto/user-image/upsert-user-image.dto';
import { ResponseBase } from '@/types/response/response-base';
import { supabase } from '@/utils/supabase-client';
import { prisma } from 'prisma/prisma-client';

export class UserImageService {
    private constructor() {}

    static async upsert(file: File, upsertUserImageDto: UpsertUserImageDto): Promise<ResponseBase> {
        try {
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            const existingImage = await prisma.userImage.findUnique({
                where: { userId_place: { userId: userId!, place: upsertUserImageDto.place } },
            });

            const newStoragePath = `${upsertUserImageDto.place}_${Date.now()}`;

            const supabaseResponse = await supabase.storage
                .from(SupabaseBucketName.USER_IMAGES)
                .upload(newStoragePath, fileBuffer, { contentType: file.type });

            if (supabaseResponse.error) {
                throw new Error(supabaseResponse.error.message);
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(SupabaseBucketName.USER_IMAGES).getPublicUrl(newStoragePath);

            try {
                await prisma.userImage.upsert({
                    where: { userId_place: { userId: userId!, place: upsertUserImageDto.place } },
                    update: { url: publicUrl },
                    create: { userId: userId!, url: publicUrl, place: upsertUserImageDto.place },
                });
            } catch (error) {
                const supabaseResponse = await supabase.storage
                    .from(SupabaseBucketName.USER_IMAGES)
                    .remove([newStoragePath]);

                if (supabaseResponse.error)
                    console.error('Failed to delete user image from storage:', supabaseResponse.error.message);

                throw error;
            }

            if (existingImage) {
                const oldFileName = existingImage.url.split('/').pop()?.split('?')[0];
                if (oldFileName) {
                    const { error } = await supabase.storage.from(SupabaseBucketName.USER_IMAGES).remove([oldFileName]);

                    if (error) {
                        console.error('Failed to delete old from storage:', error.message);
                    }
                }
            }

            return { isSuccess: true, message: 'image uploaded', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async delete(deleteUserImageDto: DeleteUserImageDto): Promise<ResponseBase> {
        try {
            const existingImage = await prisma.userImage.findUnique({
                where: { userId_place: { userId: userId!, place: deleteUserImageDto.place } },
            });

            if (!existingImage) {
                return { isSuccess: false, message: 'image not found', statusCode: 404 };
            }

            await prisma.userImage.delete({
                where: { userId_place: { userId: userId!, place: deleteUserImageDto.place } },
            });

            const fileName = existingImage.url.split('/').pop()?.split('?')[0];

            if (fileName) {
                const { error } = await supabase.storage.from(SupabaseBucketName.USER_IMAGES).remove([fileName]);

                if (error) {
                    console.error('Failed to delete from storage:', error.message);
                }
            }

            return { isSuccess: true, message: 'image deleted', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
