import { Prisma } from "@/generated/client";

export type ExtendedSkillModel = Prisma.SkillGetPayload<{
    include: {
        experiences: true,
        educations: true,
        portfolioItems: true,
    }
}>;
