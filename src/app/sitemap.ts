import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.washduringworkout.com';

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '/',                  changeFrequency: 'daily',   priority: 1.0 },
    { path: '/services',          changeFrequency: 'monthly', priority: 0.9 },
    { path: '/memberships',       changeFrequency: 'monthly', priority: 0.9 },
    { path: '/gallery',           changeFrequency: 'monthly', priority: 0.8 },
    { path: '/about',             changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact',           changeFrequency: 'monthly', priority: 0.8 },
    { path: '/privacy',           changeFrequency: 'monthly', priority: 0.3 },
    { path: '/terms',             changeFrequency: 'monthly', priority: 0.3 },
    { path: '/refund-policy',     changeFrequency: 'monthly', priority: 0.3 },
    { path: '/sms-consent',       changeFrequency: 'monthly', priority: 0.3 },
    { path: '/accessibility',     changeFrequency: 'monthly', priority: 0.3 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
