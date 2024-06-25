/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['laravel-jouleskitchen.cleartwo.xyz'],
    },
}

module.exports = nextConfig
