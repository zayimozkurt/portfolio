import { UUID_REGEX } from "@/constants/uuid-regex.constant";

export function isValidUUID(id: string): boolean {
    if (!id) return false;

    return UUID_REGEX.test(id);
}
