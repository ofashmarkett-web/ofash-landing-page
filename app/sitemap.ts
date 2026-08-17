import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only the two public, indexable routes. /admin is gated and excluded in
  // robots.ts; the legal copy renders in dialogs rather than at its own URLs.
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/waitlist`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
