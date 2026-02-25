import { Prisma } from '@/generated/client';

export type ExtendedUserModel = Prisma.UserGetPayload<{
    include: {
        skills: true,
        userImages: true,
        contacts: true,
        experiences: { include: { skills: true } },
        educations: { include: { skills: true } },
        portfolioItems: true,
    }
}>;
