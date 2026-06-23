"use client";

import Image from "next/image";
import { useInView } from "../../hooks/useInView";
import { GalleryIntrinsicTile } from "./GalleryIntrinsicTile";

type GalleryTile = { src: string; alt: string };

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

/**
 * Yoga grid. The left column is a tall feature image and the remaining 5
 * slots fill the 2×3 cluster on the right. Slot order: feature (0), then
 * row1-right (1), row2-middle (2), row2-right (3), row3-middle (4),
 * row3-right (5).
 */
export function YogaTherapySection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  const [feature, r1r, r2m, r2r, r3m, r3r] = images;
  const dividerInView = useInView({ threshold: 0.12 });

  return (
    <section className="bg-white px-4 pb-5">
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

        <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.82fr)_minmax(0,0.82fr)] lg:grid-rows-3 lg:gap-4">
          <GalleryIntrinsicTile
            tile={feature}
            className="max-lg:col-span-2 max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:col-span-1 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 44vw, 100vw"
            fadeDelayMs={140}
          />
          <div
            className="hidden min-h-0 lg:col-start-2 lg:row-start-1 lg:block"
            aria-hidden
          />
          <GalleryIntrinsicTile
            tile={r1r}
            className="max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px] lg:col-start-3 lg:row-start-1 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={180}
          />
          <GalleryIntrinsicTile
            tile={r2m}
            className="max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px] lg:col-start-2 lg:row-start-2 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={220}
          />
          <GalleryIntrinsicTile
            tile={r2r}
            className="max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:col-start-3 lg:row-start-2 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={260}
          />
          <GalleryIntrinsicTile
            tile={r3m}
            className="max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:col-start-2 lg:row-start-3 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={300}
          />
          <GalleryIntrinsicTile
            tile={r3r}
            className="max-lg:col-span-2 max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px] lg:col-span-1 lg:col-start-3 lg:row-start-3 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 18vw, 100vw"
            fadeDelayMs={340}
          />
        </div>
      </div>
    </section>
  );
}
