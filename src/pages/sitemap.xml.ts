import { pages, siteUrl } from '../data/seo';

export function GET() {
  const urls = Object.entries(pages)
    .filter(([, page]) => page.index !== false)
    .map(([path]) => `<url><loc>${siteUrl}${path}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
