import { defineConfig, env } from 'prisma/config';
import './envConfig';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    engine: 'classic',
    datasource: {
        url: env('DATABASE_URL'),
    },
});
