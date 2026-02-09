import { Prisma } from '@/generated/client';

export type ExtendedUserModel = Prisma.UserGetPayload<{
    include: {
        skills: true,
        userImages: true,
        contacts: true,
        experiences: true,
        educations: true,
        portfolioItems: true,
    }
}>;
