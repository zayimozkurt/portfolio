import { Prisma } from "@/generated/client";

export type ExtendedExperienceModel = Prisma.ExperienceGetPayload<{
    include: {
        skills: true
    }
}>;
