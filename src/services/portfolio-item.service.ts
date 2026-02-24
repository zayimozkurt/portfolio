import { userId } from '@/constants/user-id.constant';
import { SupabaseBucketName } from '@/enums/supabase-bucket-name.enum';
import { InputJsonValue } from '@/generated/client/runtime/library';
import { CleanUpOrphanedPortfolioImagesDto } from '@/types/dto/portfolio-item/clean-up-orphaned-portfolio-images.dto';
import { CreatePortfolioItemDto } from '@/types/dto/portfolio-item/create-portfolio-item.dto';
import { ReorderPortfolioItemsDto } from '@/types/dto/portfolio-item/reorder-portfolio-items.dto';
import { UpdatePortfolioItemDto } from '@/types/dto/portfolio-item/update-portfolio-item.dto';
import { UploadPortfolioItemImageDto } from '@/types/dto/portfolio-item/upload-portfolio-item-image.dto';
import { ReadMultipleExtendedPortfolioItemsResponse } from '@/types/response/portfolio-item/read-multiple-extended-portfolio-items.response';
import { ReadMultiplePortfolioItemsResponse } from '@/types/response/portfolio-item/read-multiple-portfolio-items.response';
import { ReadSingleExtendedPortfolioItemResponse } from '@/types/response/portfolio-item/read-single-extended-portfolio-item.response';
import { ReadSinglePortfolioItemResponse } from '@/types/response/portfolio-item/read-single-portfolio-item.response';
import { UploadPortfolioItemImageResponse } from '@/types/response/portfolio-item/upload-portfolio-item-image.response';
import { ResponseBase } from '@/types/response/response-base';
import { TransactionClient } from '@/types/transaction-client.type';
import { extractImageUrlsFromTipTapJson } from '@/utils/extract-image-urls-from-tip-tap-json.util';
import { supabase } from '@/utils/supabase-client';
import { prisma } from 'prisma/prisma-client';

export class PortfolioItemService {
    private constructor() {}

    static async create(dto: CreatePortfolioItemDto): Promise<ResponseBase> {
        try {
            const duplicatePortfolioItem = await prisma.portfolioItem.findFirst({
                where: {
                    userId,
                    title: dto.title
                }
            });

            if (duplicatePortfolioItem) {
                return {
                    isSuccess: false,
                    message: `Portfolio item with title ${dto.title} already exists`,
                    statusCode: 409,
                };
            }

            await prisma.$transaction(async (tx: TransactionClient) => {

                await tx.portfolioItem.updateMany({
                    where: { userId },
                    data: { order: { increment: 1 } },
                });

                await tx.portfolioItem.create({
                    data: {
                        userId,
                        ...dto,
                        order: 0,
                    },
                });
            });

            return { isSuccess: true, message: 'portfolio item created', statusCode: 201 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readById(id: string): Promise<ReadSinglePortfolioItemResponse> {
        try {
            const portfolioItem = await prisma.portfolioItem.findUnique({ where: { id } });

            if (!portfolioItem) return { isSuccess: false, message: "portfolio item couldn't read", statusCode: 404 };

            return { isSuccess: true, message: 'portfolio item read', portfolioItem, statusCode: 200 };
        } catch {
            return { isSuccess: false, message: "portfolio item couldn't be read", statusCode: 500 };
        }
    }

    static async readExtendedById(id: string): Promise<ReadSingleExtendedPortfolioItemResponse> {
        try {
            const portfolioItem = await prisma.portfolioItem.findUnique({ where: { id }, include: { skills: true } });

            if (!portfolioItem) return { isSuccess: false, message: "portfolio item couldn't read", statusCode: 404 };

            return { isSuccess: true, message: 'portfolio item read', portfolioItem, statusCode: 200 };
        } catch {
            return { isSuccess: false, message: "portfolio item couldn't be read", statusCode: 500 };
        }
    }

    static async readAllByUserId(): Promise<ReadMultiplePortfolioItemsResponse> {
        try {
            const portfolioItems = await prisma.portfolioItem.findMany({ where: { userId }, orderBy: { order: 'asc' } });

            return { isSuccess: true, message: 'all portfolio items read', portfolioItems, statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readAllExtendedByUserId(): Promise<ReadMultipleExtendedPortfolioItemsResponse> {
        try {
            const portfolioItems = await prisma.portfolioItem.findMany({ where: { userId }, orderBy: { order: 'asc' }, include: { skills: true } });

            return { isSuccess: true, message: 'all portfolio items read', portfolioItems, statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async updateById(id: string, dto: UpdatePortfolioItemDto): Promise<ResponseBase> {
        try {
            if (dto.title) {
                const duplicatePortfolioItem = await prisma.portfolioItem.findFirst({
                    where: {
                        userId,
                        title: dto.title,
                        NOT: { id }
                    }
                });

                if (duplicatePortfolioItem) {
                    return {
                        isSuccess: false,
                        message: `Portfolio item with title ${dto.title} already exists`,
                        statusCode: 409,
                    };
                }
            }

            await prisma.portfolioItem.update({
                where: {
                    id,
                },
                data: {
                    ...dto,
                    content: dto.content as InputJsonValue,
                },
            });

            if (dto.content) {
                PortfolioItemService
                    .cleanUpOrphanedImagesFromContent({
                        portfolioItemId: id,
                        content: dto.content,
                    })
                    .catch(console.error);
            }

            return { isSuccess: true, message: 'Portfolio item updated', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async deleteById(id: string): Promise<ResponseBase> {
        try {
            const readPortfolioItemResponse = await this.readById(id);

            if (!readPortfolioItemResponse.isSuccess || !readPortfolioItemResponse.portfolioItem) return readPortfolioItemResponse;

            const portfolioItem = readPortfolioItemResponse.portfolioItem;

            await prisma.$transaction(async (tx: TransactionClient) => {
                await tx.portfolioItem.delete({ where: { id } });

                await tx.portfolioItem.updateMany({
                    where: { userId, order: { gt: portfolioItem.order }  },
                    data: { order: { decrement: 1 } },
                });
            });

            const { data: files } = await supabase.storage.from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES).list(id);

            if (files && files.length > 0) {
                const filePaths = files.map((f) => `${id}/${f.name}`);

                const supabaseResponse = await supabase.storage.from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES).remove(filePaths);

                if (supabaseResponse.error) console.error(supabaseResponse.error);
            }

            return { isSuccess: true, message: 'portfolio item deleted', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async reorder(dto: ReorderPortfolioItemsDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(
                dto.orderedIds.map((id, index) =>
                    prisma.portfolioItem.update({ where: { id }, data: { order: index } })
                )
            );

            return { isSuccess: true, message: 'portfolio items reordered', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async uploadImage(
        file: File,
        uploadPortfolioItemImageDto: UploadPortfolioItemImageDto
    ): Promise<UploadPortfolioItemImageResponse> {
        const { portfolioItemId } = uploadPortfolioItemImageDto;

        try {
            const portfolioItem = await prisma.portfolioItem.findUnique({ where: { id: portfolioItemId } });
            if (!portfolioItem) {
                return { isSuccess: false, message: 'portfolio item not found', statusCode: 404 };
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const storagePath = `${portfolioItemId}/${Date.now()}_${sanitizedFilename}`;

            const { error: uploadError } = await supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .upload(storagePath, buffer, { contentType: file.type });

            if (uploadError) {
                return { isSuccess: false, message: uploadError.message, statusCode: 500 };
            }

            const { data: publicUrlData } = supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .getPublicUrl(storagePath);

            return {
                isSuccess: true,
                message: 'image uploaded',
                url: publicUrlData.publicUrl,
                statusCode: 200,
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async cleanUpOrphanedImagesFromContent(dto: CleanUpOrphanedPortfolioImagesDto): Promise<ResponseBase> {
        if (typeof dto.content !== 'object' || (dto.content as { type: string }).type !== 'doc') {
            return { isSuccess: false, message: 'content is not in intended form', statusCode: 400 };
        }

        try {
            const { data: files } = await supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .list(dto.portfolioItemId);
            if (!files || files.length === 0) return { isSuccess: true, message: 'no orphaned images to remove', statusCode: 200 };

            const referencedUrls = extractImageUrlsFromTipTapJson(dto.content);

            const orphanedPaths: string[] = [];
            for (const file of files) {
                const filePath = `${dto.portfolioItemId}/${file.name}`;
                const { data: publicUrlData } = supabase.storage
                    .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                    .getPublicUrl(filePath);

                if (!referencedUrls.has(publicUrlData.publicUrl)) {
                    orphanedPaths.push(filePath);
                }
            }

            if (orphanedPaths.length > 0) {
                await supabase.storage.from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES).remove(orphanedPaths);
            }

            return { isSuccess: true, message: 'orphaned images removed', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async upsertCoverImage(id: string, file: File): Promise<ResponseBase> {
        try {
            const imageBuffer = Buffer.from(await file.arrayBuffer());

            const readPortfolioItemByIdResponse = await this.readById(id);

            if (!readPortfolioItemByIdResponse.isSuccess || !readPortfolioItemByIdResponse.portfolioItem)
                return readPortfolioItemByIdResponse;

            const existingCoverImageUrl = readPortfolioItemByIdResponse.portfolioItem.coverImageUrl;

            const newStoragePath = `${id}/cover_image_${Date.now()}`;

            const supabaseUploadResponse = await supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .upload(newStoragePath, imageBuffer, { contentType: file.type });

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
            } = supabase.storage.from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES).getPublicUrl(newStoragePath);

            const updatePortfolioItemResponse = await this.updateById(id, {
                coverImageUrl: publicUrl,
            } as UpdatePortfolioItemDto);

            if (!updatePortfolioItemResponse.isSuccess) {
                const supabaseResponse = await supabase.storage
                    .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                    .remove([newStoragePath]);

                if (supabaseResponse.error)
                    console.error(supabaseResponse.error);

                return updatePortfolioItemResponse;
            }

            if (existingCoverImageUrl && existingCoverImageUrl.length !== 0) {
                const urlParts = existingCoverImageUrl.split('/');
                const oldFileName = urlParts[urlParts.length - 1].split('?')[0];
                const oldFilePath = `${id}/${oldFileName}`;

                const { error } = await supabase.storage
                    .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                    .remove([oldFilePath]);

                if (error) console.error(error);
            }

            return { isSuccess: true, message: 'cover image uploaded', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async deleteCoverImage(portfolioItemId: string): Promise<ResponseBase> {
        try {
            const readPortfolioItemByIdResponse = await this.readById(portfolioItemId);

            if (!readPortfolioItemByIdResponse.isSuccess || !readPortfolioItemByIdResponse.portfolioItem)
                return readPortfolioItemByIdResponse;

            const existingCoverImageUrl = readPortfolioItemByIdResponse.portfolioItem.coverImageUrl;

            if (!existingCoverImageUrl) {
                return { isSuccess: true, message: "there already isn't a cover image", statusCode: 200 };
            }

            const updatePortfolioItemResponse = await this.updateById(portfolioItemId, {
                coverImageUrl: null,
            } as UpdatePortfolioItemDto);

            if (!updatePortfolioItemResponse.isSuccess)
                return updatePortfolioItemResponse;

            const fileName = existingCoverImageUrl.split('/').pop()?.split('?')[0];
            const filePath = `${portfolioItemId}/${fileName}`;

            const { error } = await supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .remove([filePath]);

            if (error) console.error(error);

            return { isSuccess: true, message: 'cover image deleted', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
