/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['api.jouleskitchen.co.uk'],
    },
}

module.exports = nextConfig
