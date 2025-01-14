/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['api.jouleskitchen.co.uk','laravel-jouleskitchen.cleartwo.uk'],
    },
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL, // Expose the BASE_URL (optional)
    },
}

module.exports = nextConfig
