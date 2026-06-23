"use client";

import Image from "next/image";
import { useInView } from "../../hooks/useInView";
import type { GalleryTile } from "./GalleryIntrinsicTile";
import { GalleryIntrinsicTile } from "./GalleryIntrinsicTile";

const getInitialTransform = (
  direction: "up" | "down" | "left" | "right" | "none",
  distance: number,
): string => {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(-${distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(-${distance}px)`;
    default:
      return "none";
  }
};

const TILE_ROUNDING = [
  "rounded-tl-[18px] rounded-br-[18px] rounded-tr-[48px] rounded-bl-[48px] md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]",
  "rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px] md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]",
  "rounded-tl-[18px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[18px] md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]",
  "rounded-tr-[18px] rounded-tl-[48px] rounded-bl-[18px] rounded-br-[48px] md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]",
  "rounded-tl-[48px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[48px] md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]",
] as const;

/**
 * Masonry gallery section — only renders when images are present.
 */
export function GalleryCategoryMasonrySection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  if (images.length === 0) return null;

  const dividerInView = useInView({ threshold: 0.12 });

  return (
    <section className="bg-white px-4 py-5">
      <div className="mx-auto w-full max-w-[90vw] px-4">
        <div
          ref={dividerInView.ref}
          className="relative my-10 flex items-center justify-center lg:my-12"
          style={{
            opacity: dividerInView.isInView ? 1 : 0,
            transform: dividerInView.isInView
              ? "translate(0,0)"
              : getInitialTransform("up", 22),
            transition:
              "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: "120ms",
          }}
        >
          <div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary"
            aria-hidden
          />
          <div className="relative flex items-center gap-2 bg-white px-3 lg:px-4">
            <Image
              src="/sparkle.svg"
              alt="Sparkle icon"
              width={18}
              height={18}
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="text-center text-sm font-medium text-primary lg:text-[15px]">
              {sectionTitle}
            </span>
          </div>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img, index) => (
            <div key={img.src} className="mb-4 break-inside-avoid">
              <GalleryIntrinsicTile
                tile={img}
                className={TILE_ROUNDING[index % TILE_ROUNDING.length]}
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 92vw"
                animate={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
