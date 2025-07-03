export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /presentation-editor/
Disallow: /profile/
Disallow: /settings/

Sitemap: https://presentpro.vercel.app/sitemap.xml`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}