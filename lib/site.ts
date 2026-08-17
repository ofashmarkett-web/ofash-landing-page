/**
 * Canonical origin, used for metadataBase, robots and the sitemap.
 *
 * Vercel exposes the deployment host but not the scheme, so preview builds get
 * a working absolute URL without hardcoding the production domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://o-fashmarkett.com");
