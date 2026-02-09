import { Prisma } from "@/generated/client";

export type ExtendedEducationModel = Prisma.EducationGetPayload<{
    include: {
        skills: true
    }
}>;
