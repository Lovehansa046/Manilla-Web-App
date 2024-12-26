import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true, // Рекомендуется для улучшения производительности
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'example.com', // Пример для добавления доменов для изображений
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me', // Добавляем домен randomuser.me
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            }

        ],
    },
    eslint: {
        // Здесь указываются правила для ESLint
        ignoreDuringBuilds: true, // Игнорировать ESLint ошибки при сборке
    },
};

export default nextConfig;
