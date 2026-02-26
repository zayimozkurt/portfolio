import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    devIndicators: false,
    experimental: {
        authInterrupts: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.plugins = [...config.plugins, new PrismaPlugin()];
        }
        return config;
    },
    turbopack: {},
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            new URL(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/**`),
            new URL('https://*.supabase.co/storage/v1/object/public/**'),
        ],
    },
};

export default nextConfig;
