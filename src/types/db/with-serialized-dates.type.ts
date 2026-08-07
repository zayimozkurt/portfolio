/**
 * The client-side shape of a record with a date range. Prisma hands back `Date`
 * objects on the server, but anything that reaches the browser has been through
 * JSON, so the dates arrive as ISO strings.
 */
export type WithSerializedDates<T> = Omit<T, 'startDate' | 'endDate'> & {
    startDate: string;
    endDate: string | null;
};
