/**
 * Escalating backoff after repeated failed sign-ins, in the spirit of a phone
 * lock screen: a few free tries, then rapidly growing waits. The key is the
 * running number of consecutive failures; anything beyond the last entry keeps
 * the longest wait, so there is no state the owner can lock themselves out of
 * permanently.
 */
export const SIGN_IN_LOCKOUT_MINUTES_BY_ATTEMPT: Record<number, number> = {
    5: 1,
    6: 5,
    7: 15,
    8: 60,
};

export const MAX_SIGN_IN_LOCKOUT_MINUTES = 60;

export function getSignInLockoutMinutes(failedAttempts: number): number {
    const thresholds = Object.keys(SIGN_IN_LOCKOUT_MINUTES_BY_ATTEMPT).map(Number);
    const lowest = Math.min(...thresholds);

    if (failedAttempts < lowest) return 0;

    return SIGN_IN_LOCKOUT_MINUTES_BY_ATTEMPT[failedAttempts] ?? MAX_SIGN_IN_LOCKOUT_MINUTES;
}
