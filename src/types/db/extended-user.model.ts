import { Prisma } from '@/generated/client';
import { WithSerializedDates } from '@/types/db/with-serialized-dates.type';

export type ExtendedUserModel = Prisma.UserGetPayload<{
    omit: { passwordHash: true, failedSignInAttempts: true, lockedUntil: true },
    include: {
        skills: true,
        userImages: true,
        contacts: true,
        experiences: { include: { skills: true } },
        educations: { include: { skills: true } },
        portfolioItems: { include: { skills: true } },
    }
}>;

/**
 * What the client actually holds. Dates survive as real `Date` objects when the
 * server passes the user straight into a client component, but come back as ISO
 * strings from `/api/visitor/user/read` — so the Redux store standardises on the
 * JSON shape and both load paths agree.
 */
export type SerializedUserModel = Omit<ExtendedUserModel, 'experiences' | 'educations'> & {
    experiences: WithSerializedDates<ExtendedUserModel['experiences'][number]>[];
    educations: WithSerializedDates<ExtendedUserModel['educations'][number]>[];
};
