import { Prisma } from '@/generated/client';

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
