import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,  // Рекомендуется для улучшения производительности
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'example.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '/**',  // Новый домен для изображений
                pathname: '/**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,  // Игнорировать ошибки ESLint при сборке
    },
};

export default nextConfig;
