"use client";

import Image from "next/image";
import { cn } from "../../lib/utils";

export type CertificationItem = {
  id: string;
  imageUrl: string;
  title: string;
  alt: string;
};

/**
 * Certification marquee shown on the About page.
 *
 * Renders an infinite, automatically scrolling lane of certificate cards.
 * Hovering anywhere on the lane pauses the animation so visitors can
 * read a specific certificate; users with `prefers-reduced-motion` see
 * a static row. The track is duplicated and translated `-50%` so the
 * loop stitches seamlessly — same pattern used by the testimonials
 * media strip (see `globals.css` -> `.marquee-track`).
 *
 * Returns `null` when no certifications exist so the section
 * gracefully disappears on a fresh install.
 */
export function CertificationsSection({
  items,
}: {
  items: CertificationItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[#FEF9E0] pt-56 pb-12 -mt-56 md:mb-20 mb-10">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary w-full h-[1px]" />
          <h2 className="text-center text-sm font-semibold tracking-wide text-primary md:text-xl">
            Certification
          </h2>
          <div className="bg-primary w-full h-[1px]" />
        </div>
      </div>

      <CertificationsMarquee items={items} />
    </section>
  );
}

function CertificationsMarquee({ items }: { items: CertificationItem[] }) {
  // Cycle the duration based on how many items there are so a small
  // list still feels lively and a large list isn't blink-and-miss.
  const duration = `${Math.max(28, Math.min(80, items.length * 6))}s`;

  return (
    <div
      className="marquee-lane group/lane relative mt-8 overflow-hidden md:mt-10"
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      <div className="marquee-track flex items-stretch gap-6 md:gap-8">
        {[0, 1].map((copyIdx) => (
          <div
            key={copyIdx}
            className="flex shrink-0 items-stretch gap-6 md:gap-8"
            aria-hidden={copyIdx === 1 ? true : undefined}
          >
            {items.map((item) => (
              <CertificationCard
                key={`${copyIdx}-${item.id}`}
                item={item}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Soft fade masks at the edges so cards drift in/out instead of
          popping at the container boundary. Decorative only. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#FEF9E0] to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#FEF9E0] to-transparent md:w-24" />
    </div>
  );
}

function CertificationCard({ item }: { item: CertificationItem }) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center",
        "w-[260px] md:w-[320px]"
      )}
    >
      <div
        className="relative w-full overflow-hidden bg-white"
        style={{
          borderTopLeftRadius: 36,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 36,
          borderBottomLeftRadius: 12,
        }}
      >
        <Image
          src={item.imageUrl}
          alt={item.alt}
          width={640}
          height={480}
          className="h-[220px] w-full object-cover md:h-[420px]"
          sizes="(min-width: 768px) 320px, 260px"
          priority={false}
        />
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-[#1B1B1B] md:text-[15px]">
        {item.title}
      </p>
    </div>
  );
}
