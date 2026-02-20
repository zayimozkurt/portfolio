import { Prisma } from "@/generated/client";

export type ExtendedPortfolioItemModel = Prisma.PortfolioItemGetPayload<{
    include: {
        skills: true
    }
}>;
