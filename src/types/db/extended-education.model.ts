import { Prisma } from "@/generated/client";
import { WithSerializedDates } from '@/types/db/with-serialized-dates.type';

export type ExtendedEducationModel = Prisma.EducationGetPayload<{
    include: {
        skills: true
    }
}>;

export type SerializedEducationModel = WithSerializedDates<ExtendedEducationModel>;
