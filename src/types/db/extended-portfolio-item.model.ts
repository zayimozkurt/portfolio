import { Prisma } from "@/generated/client";

export type ExtendedPortfolioItemModel = Prisma.ExperienceGetPayload<{
    include: {
        skills: true
    }
}>;
