import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true, // Разрешить загрузку изображений с любого домена
    },
    eslint: {
        ignoreDuringBuilds: true, // Игнорировать ошибки ESLint при сборке
    },
};

export default nextConfig;
