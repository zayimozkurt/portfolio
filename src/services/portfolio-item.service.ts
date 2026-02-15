import { userId } from '@/constants/user-id.constant';
import { SupabaseBucketName } from '@/enums/supabase-bucket-name.enum';
import { InputJsonValue } from '@/generated/client/runtime/library';
import { CleanUpOrphanedPortfolioImagesDto } from '@/types/dto/portfolio-item/clean-up-orphaned-portfolio-images.dto';
import { CreatePortfolioItemDto } from '@/types/dto/portfolio-item/create-portfolio-item.dto';
import { ReorderPortfolioItemsDto } from '@/types/dto/portfolio-item/reorder-portfolio-items.dto';
import { UpdatePortfolioItemDto } from '@/types/dto/portfolio-item/update-portfolio-item.dto';
import { UploadPortfolioItemImageDto } from '@/types/dto/portfolio-item/upload-portfolio-item-image.dto';
import { ReadAllPortfolioItemsResponse } from '@/types/response/portfolio-item/read-all-portfolio-items-response';
import { ReadSinglePortfolioItemResponse } from '@/types/response/portfolio-item/read-single-portfolio-item-response';
import { UploadPortfolioItemImageResponse } from '@/types/response/portfolio-item/upload-portfolio-item-image.response';
import { ResponseBase } from '@/types/response/response-base';
import { TransactionClient } from '@/types/transaction-client.type';
import { extractImageUrlsFromTipTapJson } from '@/utils/extract-image-urls-from-tip-tap-json.util';
import { supabase } from '@/utils/supabase-client';
import { prisma } from 'prisma/prisma-client';

export class PortfolioItemService {
    private constructor() {}
 
    static async create(createPortfolioItemDto: CreatePortfolioItemDto): Promise<ResponseBase> {
        if (!createPortfolioItemDto.title) {
            return { isSuccess: false, message: 'title must exist' };
        }
        if (!createPortfolioItemDto.description) {
            return { isSuccess: false, message: 'description must exist' };
        }

        try {
            await prisma.$transaction(async (tx: TransactionClient) => {
                const existingPortfolioItem = await tx.portfolioItem.findFirst({
                    where: {
                        userId,
                        title: createPortfolioItemDto.title
                    }
                });
                if (existingPortfolioItem) {
                    throw new Error('Portfolio item with this title already exists');
                }

                await tx.portfolioItem.updateMany({
                    where: { userId },
                    data: { order: { increment: 1 } },
                });

                await prisma.portfolioItem.create({
                    data: {
                        userId,
                        ...createPortfolioItemDto,
                        order: 1,
                    },
                });
            });

            return { isSuccess: true, message: 'portfolio item created' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async readById(id: string): Promise<ReadSinglePortfolioItemResponse> {
        try {
            const portfolioItem = await prisma.portfolioItem.findUnique({ where: { id } });

            if (!portfolioItem) return { isSuccess: false, message: "portfolio item couldn't read" };

            return { isSuccess: true, message: 'portfolio item read', portfolioItem };
        } catch {
            return { isSuccess: false, message: "portfolio item couldn't be read" };
        }
    }

    static async readAllByUserId(): Promise<ReadAllPortfolioItemsResponse> {
        try {
            const portfolioItems = await prisma.portfolioItem.findMany({ where: { userId } });
            return { isSuccess: true, message: 'all portfolio items read', portfolioItems };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async updateById(id: string, updatePortfolioItemDto: UpdatePortfolioItemDto): Promise<ResponseBase> {
        try {
            if (updatePortfolioItemDto.title) {
                const existingPortfolioItem = await prisma.portfolioItem.findFirst({
                    where: {
                        userId,
                        title: updatePortfolioItemDto.title
                    }
                });

                if (existingPortfolioItem) {
                    throw new Error('Portfolio item with this title already exists');
                }
            }

            await prisma.portfolioItem.update({
                where: {
                    id,
                },
                data: {
                    ...updatePortfolioItemDto,
                    content: updatePortfolioItemDto.content as InputJsonValue,
                },
            });

            if (updatePortfolioItemDto.content) {
                PortfolioItemService
                    .cleanUpOrphanedImages({
                        portfolioItemId: id,
                        content: updatePortfolioItemDto.content,
                    })
                    .catch(console.error);
            }

            return { isSuccess: true, message: 'updated' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async deleteById(id: string): Promise<ResponseBase> {
        try {
            const { data: files } = await supabase.storage.from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES).list(id);

            if (files && files.length > 0) {
                const filePaths = files.map((f) => `${id}/${f.name}`);
                await supabase.storage.from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES).remove(filePaths);
            }

            await prisma.portfolioItem.delete({ where: { id } });

            return { isSuccess: true, message: 'portfolio item deleted' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async reorder(dto: ReorderPortfolioItemsDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(
                dto.orderedIds.map((id, index) =>
                    prisma.portfolioItem.update({ where: { id }, data: { order: index } })
                )
            );

            return { isSuccess: true, message: 'portfolio items reordered' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async uploadImage(
        uploadPortfolioItemImageDto: UploadPortfolioItemImageDto
    ): Promise<UploadPortfolioItemImageResponse> {
        if (!uploadPortfolioItemImageDto.file) {
            return { isSuccess: false, message: "file doesn't exist" };
        }
        if (!uploadPortfolioItemImageDto.file.type.startsWith('image/')) {
            return { isSuccess: false, message: 'file must be an image' };
        }
        if (!uploadPortfolioItemImageDto.portfolioItemId) {
            return { isSuccess: false, message: 'portfolioItemId is not provided' };
        }

        const { portfolioItemId, file } = uploadPortfolioItemImageDto;

        try {
            const portfolioItem = await prisma.portfolioItem.findUnique({ where: { id: portfolioItemId } });
            if (!portfolioItem) {
                return { isSuccess: false, message: 'portfolio item not found' };
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const storagePath = `${portfolioItemId}/${Date.now()}_${sanitizedFilename}`;

            const { error: uploadError } = await supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .upload(storagePath, buffer, { contentType: file.type });

            if (uploadError) {
                return { isSuccess: false, message: uploadError.message };
            }

            const { data: publicUrlData } = supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .getPublicUrl(storagePath);

            return {
                isSuccess: true,
                message: 'image uploaded',
                url: publicUrlData.publicUrl,
            };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async cleanUpOrphanedImages(dto: CleanUpOrphanedPortfolioImagesDto): Promise<ResponseBase> {
        if (!dto.portfolioItemId || !dto.content) {
            return { isSuccess: false, message: "portfolioItemId or content isn't provided" };
        }
        if (typeof dto.content !== 'object' || (dto.content as { type: string }).type !== 'doc') {
            return { isSuccess: false, message: 'content is not in intended form' };
        }
        try {
            const { data: files } = await supabase.storage
                .from(SupabaseBucketName.PORTFOLIO_ITEM_IMAGES)
                .list(dto.portfolioItemId);
            if (!files || files.length === 0) return { isSuccess: true, message: 'no orphaned images to remove' };

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

            return { isSuccess: true, message: 'orphaned images removed' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }
}
