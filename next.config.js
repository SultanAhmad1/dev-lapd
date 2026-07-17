/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        // domains: ['api.jouleskitchen.co.uk','laravel-api.jouleskitchen.co.uk'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.jouleskitchen.co.uk',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'laravel-api.jouleskitchen.co.uk',
                pathname: '/**',
            }
        ]
    },
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL, // Expose the BASE_URL (optional)
    },
    async headers() {
        return [
        {
            source: '/(.*)',
            headers: [
            {
                key: 'X-Robots-Tag',
                value: 'noindex, nofollow',
            },
            ],
        },
        ];
    },
}

module.exports = nextConfig
