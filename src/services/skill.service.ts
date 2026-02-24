import { userId } from '@/constants/user-id.constant';
import { SupabaseBucketName } from '@/enums/supabase-bucket-name.enum';
import { Prisma } from '@/generated/client';
import { InputJsonValue } from '@/generated/client/runtime/library';
import { CleanUpOrphanedSkillImagesDto } from '@/types/dto/skill/clean-up-orphaned-skill-images.dto';
import { CreateSkillDto } from '@/types/dto/skill/create-skill.dto';
import { ReorderSkillsDto } from '@/types/dto/skill/reorder-skills.dto';
import { UpdateSkillDto } from '@/types/dto/skill/update-skill.dto';
import { UploadSkillImageDto } from '@/types/dto/skill/upload-skill-image.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ReadSingleSkillResponse } from '@/types/response/skill/read-single-skill.response';
import { UploadSkillImageResponse } from '@/types/response/skill/upload-skill-image.response';
import { TransactionClient } from '@/types/transaction-client.type';
import { extractImageUrlsFromTipTapJson } from '@/utils/extract-image-urls-from-tip-tap-json.util';
import { supabase } from '@/utils/supabase-client';
import { prisma } from 'prisma/prisma-client';

export class SkillService {
    private constructor() {}

    static async create(dto: CreateSkillDto): Promise<ResponseBase> {
        try {
            const duplicateSkill = await prisma.skill.findFirst({
                where: {
                    userId,
                    name: dto.name
                }
            });

            if (duplicateSkill)
                return {
                    isSuccess: false,
                    message: `Failed! A skill with name ${dto.name} already exists.`,
                    statusCode: 409,
                };

            await prisma.$transaction(async (tx: TransactionClient) => {
                await tx.skill.updateMany({
                    where: { userId },
                    data: { order: { increment: 1 } },
                });

                await tx.skill.create({
                    data: {
                        userId,
                        name: dto.name,
                        order: 0,
                        content: Prisma.JsonNull,
                    },
                });
            });

            return { isSuccess: true, message: 'skill created', statusCode: 201 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readById(id: string): Promise<ReadSingleSkillResponse> {
        try {
            const skill = await prisma.skill.findUnique({ where: { id }, include: { experiences: true, educations: true, portfolioItems: true } });

            if (!skill) return { isSuccess: false, message: "skill couldn't be read", statusCode: 404 };

            return { isSuccess: true, message: 'skill read', skill, statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async updateById(id: string, dto: UpdateSkillDto): Promise<ResponseBase> {
        try {
            const skill = await prisma.skill.findUnique({ where: { id } });

            if (!skill) {
                return { isSuccess: false, message: 'skill not found', statusCode: 404 };
            }

            const { name, content, ...restOfDto } = dto;

            const duplicateSkill = await prisma.skill.findFirst({
                where: {
                    userId,
                    name,
                    NOT: { id }
                }
            });

            if (duplicateSkill)
                return {
                    isSuccess: false,
                    message: `Failed! A skill with name ${name} already exists.`,
                    statusCode: 409,
                };

            await prisma.skill.update({
                where: { id },
                data: {
                    name: name ?? skill.name,
                    content: content !== undefined ? (content as InputJsonValue) : undefined,
                    ...restOfDto,
                },
            });

            if (content) {
                SkillService
                    .cleanUpOrphanedImages({
                        skillId: id,
                        content,
                    })
                    .catch(console.error);
            }

            return { isSuccess: true, message: 'skill updated', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async deleteById(id: string): Promise<ResponseBase> {
        try {
            const skill = await prisma.skill.findUnique({ where: { id } });
            if (!skill) {
                return { isSuccess: false, message: 'skill not found', statusCode: 404 };
            }

            await prisma.$transaction(async (tx: TransactionClient) => {
                await tx.skill.delete({ where: { id } });

                await tx.skill.updateMany({
                    where: {
                        userId: skill.userId,
                        order: { gt: skill.order },
                    },
                    data: {
                        order: { decrement: 1 },
                    },
                });
            });

            return { isSuccess: true, message: 'skill deleted', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async reorder(dto: ReorderSkillsDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(
                dto.orderedIds.map((id, index) => prisma.skill.update({ where: { id }, data: { order: index } }))
            );

            return { isSuccess: true, message: 'skills reordered', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async uploadImage(file: File, dto: UploadSkillImageDto): Promise<UploadSkillImageResponse> {
        const { skillId } = dto;

        try {
            const skill = await prisma.skill.findUnique({ where: { id: skillId } });
            if (!skill) {
                return { isSuccess: false, message: 'skill not found', statusCode: 404 };
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const storagePath = `${skillId}/${Date.now()}_${sanitizedFilename}`;

            const { error: uploadError } = await supabase.storage
                .from(SupabaseBucketName.SKILL_IMAGES)
                .upload(storagePath, buffer, { contentType: file.type });

            if (uploadError) {
                return { isSuccess: false, message: uploadError.message, statusCode: 500 };
            }

            const { data: publicUrlData } = supabase.storage
                .from(SupabaseBucketName.SKILL_IMAGES)
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

    static async cleanUpOrphanedImages(dto: CleanUpOrphanedSkillImagesDto): Promise<ResponseBase> {
        if (typeof dto.content !== 'object' || (dto.content as { type: string }).type !== 'doc') {
            return { isSuccess: false, message: 'content is not in intended form', statusCode: 400 };
        }
        try {
            const { data: files } = await supabase.storage.from(SupabaseBucketName.SKILL_IMAGES).list(dto.skillId);
            if (!files || files.length === 0) return { isSuccess: true, message: 'no orphaned images to remove', statusCode: 200 };

            const referencedUrls = extractImageUrlsFromTipTapJson(dto.content);

            const orphanedPaths: string[] = [];
            for (const file of files) {
                const filePath = `${dto.skillId}/${file.name}`;
                const { data: publicUrlData } = supabase.storage
                    .from(SupabaseBucketName.SKILL_IMAGES)
                    .getPublicUrl(filePath);

                if (!referencedUrls.has(publicUrlData.publicUrl)) {
                    orphanedPaths.push(filePath);
                }
            }

            if (orphanedPaths.length > 0) {
                await supabase.storage.from(SupabaseBucketName.SKILL_IMAGES).remove(orphanedPaths);
            }

            return { isSuccess: true, message: 'orphaned images removed', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
