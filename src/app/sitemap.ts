import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://heptafit.com';
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/athlete-management-software',
    '/glossary',
    '/docs',
    '/resources/blog',
    '/features/ai-coach',
    '/tools/training-load-calculator',
    '/faq',
    '/research',
    '/changelog',
    '/compare/heptafit-vs-spreadsheets',
    '/developers'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
