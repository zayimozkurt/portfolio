import { Prisma } from "@/generated/client";
import { WithSerializedDates } from '@/types/db/with-serialized-dates.type';

export type ExtendedExperienceModel = Prisma.ExperienceGetPayload<{
    include: {
        skills: true
    }
}>;

export type SerializedExperienceModel = WithSerializedDates<ExtendedExperienceModel>;
