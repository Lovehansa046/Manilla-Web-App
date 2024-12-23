import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true, // Рекомендуется для улучшения производительности
    images: {
        domains: ['example.com'], // Пример для добавления доменов для изображений
    },

};

export default nextConfig;
