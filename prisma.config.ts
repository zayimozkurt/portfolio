import { defineConfig } from 'prisma/config';
import './envConfig';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    engine: 'classic',
    datasource: {
        // CLI-only (db push, studio). These need a real session connection, not the
        // transaction pooler the app runs on, so prefer DIRECT_URL when it is set.
        url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
    },
});
