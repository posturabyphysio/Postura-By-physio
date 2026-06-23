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
 * Split-feature grid used for the Aerobics category. Expects up to 6 images
 * mapped to the following slots (in order):
 *   0: col1 row1   1: col2 row1   2: col1 row2
 *   3: col1 row3   4: col2 row3   5: col3 feature (right-hand tall)
 */
export function GallerySplitFeatureSection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  const [col1Row1, col2Row1, col1Row2, col1Row3, col2Row3, col3Feature] =
    images;
  const dividerInView = useInView({ threshold: 0.12 });

  return (
    <section className="bg-white px-4 pb-5 lg:pt-0">
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

        <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,0.82fr)_minmax(0,1.5fr)] lg:grid-rows-3 lg:gap-4">
          <GalleryIntrinsicTile
            tile={col1Row1}
            className="max-lg:order-1 rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px] lg:order-none lg:col-start-1 lg:row-start-1 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={140}
          />
          <GalleryIntrinsicTile
            tile={col2Row1}
            className="max-lg:order-2 rounded-tr-[48px] rounded-tl-[18px] rounded-bl-[48px] rounded-br-[18px] lg:order-none lg:col-start-2 lg:row-start-1 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={180}
          />
          <GalleryIntrinsicTile
            tile={col1Row2}
            className="max-lg:order-3 rounded-tl-[18px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[18px] lg:order-none lg:col-start-1 lg:row-start-2 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={220}
          />
          <div
            className="hidden min-h-0 lg:col-start-2 lg:row-start-2 lg:block"
            aria-hidden
          />
          <GalleryIntrinsicTile
            tile={col1Row3}
            className="max-lg:order-5 max-lg:col-span-2 rounded-tl-[18px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[18px] lg:order-none lg:col-span-1 lg:col-start-1 lg:row-start-3 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 18vw, 100vw"
            fadeDelayMs={260}
          />
          <GalleryIntrinsicTile
            tile={col2Row3}
            className="max-lg:order-4 rounded-tr-[18px] rounded-tl-[48px] rounded-bl-[18px] rounded-br-[48px] lg:order-none lg:col-start-2 lg:row-start-3 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 18vw, 45vw"
            fadeDelayMs={300}
          />
          <GalleryIntrinsicTile
            tile={col3Feature}
            className="max-lg:order-6 max-lg:col-span-2 rounded-tr-[18px] rounded-tl-[48px] rounded-bl-[18px] rounded-br-[48px] lg:order-none lg:col-span-1 lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 44vw, 100vw"
            fadeDelayMs={340}
          />
        </div>
      </div>
    </section>
  );
}
