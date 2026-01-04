import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://example.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/dashboard/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
