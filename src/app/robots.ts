import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/book',
        '/track',
        '/member',
        '/refer',
        '/ops/',
        '/admin/',
      ],
    },
    sitemap: 'https://www.washduringworkout.com/sitemap.xml',
  };
}
