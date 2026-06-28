/**
 * Derives a 1–2 letter monogram from a full name.
 * First letter of the first word + first letter of the last word, uppercased.
 * Falls back gracefully for single-word or empty names.
 */
export function getInitials(fullName?: string | null): string {
    const words = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    const first = words[0][0];
    const last = words[words.length - 1][0];
    return `${first}${last}`.toUpperCase();
}
