import { prisma } from 'prisma/prisma-client';

/**
 * This app is single-tenant: exactly one User row owns everything. The id is
 * resolved from the database once per process and cached, so the rest of the
 * code can keep scoping its queries by userId without an env var pinning it.
 */
let cachedUserId: string | undefined;

export async function getUserId(): Promise<string> {
    if (cachedUserId) return cachedUserId;

    const user = await prisma.user.findFirst({ select: { id: true } });
    if (!user) throw new Error('No user row found — seed a user before running the app.');

    cachedUserId = user.id;
    return cachedUserId;
}
