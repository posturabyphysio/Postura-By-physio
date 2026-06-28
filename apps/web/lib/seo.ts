import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.posturabyphysio.com";
export const SITE_NAME = "Postura by Physio";
export const PRIMARY_CITY = "Vadodara";
export const PRIMARY_REGION = "Gujarat";
export const CONTACT_PHONE = "+91-6354011290";
export const CONTACT_EMAIL = "posturabyphysio@gmail.com";
export const INSTAGRAM_URL =
  "https://www.instagram.com/postura_by_physio?igsh=MTk0NGNyZ3htY3U1Zg==";

export const DEFAULT_DESCRIPTION = `${SITE_NAME} offers personalized physiotherapy and movement programs by Dr. Priyanshi Pandya (MPT, MIAFT). Doorstep care in ${PRIMARY_CITY}, ${PRIMARY_REGION} — rehab, posture correction, and guided fitness.`;

export const DEFAULT_KEYWORDS = [
  "Postura by Physio",
  "physiotherapy",
  "physiotherapist",
  "posture correction",
  "rehabilitation",
  "pain management",
  PRIMARY_CITY,
  PRIMARY_REGION,
  "doorstep physiotherapy",
  "pilates",
  "yoga therapy",
  "Dr. Priyanshi Pandya",
];

export type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
  /** When true, title is used as-is without the layout template suffix. */
  absoluteTitle?: boolean;
};

export function pageUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}

export function pageMetadata({
  title,
  description,
  path,
  ogImage = "/about-hero.png",
  ogImageAlt,
  ogTitle,
  ogDescription,
  noIndex = false,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const canonical = pageUrl(path);
  const resolvedTitle = absoluteTitle ? { absolute: title } : title;
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt ?? socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export function blogPageUrl(slug: string): string {
  return `${SITE_URL}/blogs/${encodeURIComponent(slug)}`;
}
