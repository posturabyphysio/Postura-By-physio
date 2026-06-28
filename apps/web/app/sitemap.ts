import type { MetadataRoute } from "next";

import { getPublishedBlogs } from "@/lib/blogs";
import { blogPageUrl, pageUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: pageUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: pageUrl("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: pageUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: pageUrl("/physiotherapy"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: pageUrl("/physiotherapy-management"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: pageUrl("/aerobics-program"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/yoga-program"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/pilates-program"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/theraband-training"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/flexibar-training"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/swiss-ball-training"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/athlete-rehab"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/corporate-professionals"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/society-exercise"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/couple-exercise-program"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/pre-post-natal"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/geriatric-rehabilitation"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: pageUrl("/gallery"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: pageUrl("/testimonials"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: pageUrl("/blogs"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: pageUrl("/contact-us"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: pageUrl("/book-a-session"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: pageUrl("/patient-interaction"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: pageUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: pageUrl("/terms-and-conditions"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogs = await getPublishedBlogs();
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: blogPageUrl(b.slug),
    lastModified: new Date(b.updatedAt ?? b.publishedAt ?? b.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
