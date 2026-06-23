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
 * Corporate wellness grid. The desktop layout uses slot `b` twice (the
 * 5-col tile top-left plus the 3-col tile bottom-right) so the matrix
 * feels balanced even with a smaller image set.
 */
export function CorporateWelnessProgramSection({
  sectionTitle,
  images,
}: {
  sectionTitle: string;
  images: GalleryTile[];
}) {
  const [a, b, c, d, e] = images;
  const dividerInView = useInView({ threshold: 0.12 });

  return (
    <section className="bg-white px-4 pb-10 lg:pb-20">
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

        <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-12 lg:gap-4">
          <div className="col-span-2 max-lg:order-1 lg:col-span-3 lg:hidden">
            <GalleryIntrinsicTile
              tile={a}
              className="max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px]"
              sizes="(min-width: 1024px) 25vw, 100vw"
              fadeDelayMs={120}
            />
          </div>
          <GalleryIntrinsicTile
            tile={b}
            className="col-span-2 max-lg:order-2 max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:col-span-5 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            fadeDelayMs={140}
          />
          <GalleryIntrinsicTile
            tile={c}
            className="col-span-2 max-lg:order-3 max-lg:rounded-3xl max-lg:rounded-tl-[18px] max-lg:rounded-tr-[48px] max-lg:rounded-bl-[48px] max-lg:rounded-br-[18px] lg:col-span-4 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 25vw, 100vw"
            fadeDelayMs={180}
          />
          <GalleryIntrinsicTile
            tile={d}
            className="col-span-1 max-lg:order-4 max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:col-span-5 lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 50vw, 45vw"
            fadeDelayMs={220}
          />
          <GalleryIntrinsicTile
            tile={e}
            className="col-span-1 max-lg:order-5 max-lg:rounded-3xl max-lg:rounded-tl-[48px] max-lg:rounded-tr-[18px] max-lg:rounded-bl-[18px] max-lg:rounded-br-[48px] lg:col-span-4 lg:rounded-none lg:rounded-tl-[72px] lg:rounded-br-[72px] lg:rounded-tr-[24px] lg:rounded-bl-[24px]"
            sizes="(min-width: 1024px) 50vw, 45vw"
            fadeDelayMs={260}
          />
          <GalleryIntrinsicTile
            tile={b}
            className="hidden lg:col-span-3 lg:block lg:rounded-none lg:rounded-tr-[72px] lg:rounded-bl-[72px] lg:rounded-tl-[24px] lg:rounded-br-[24px]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            fadeDelayMs={300}
          />
        </div>
      </div>
    </section>
  );
}
