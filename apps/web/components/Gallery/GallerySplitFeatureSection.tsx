"use client";

import Image from "next/image";

const aerobicsImages = {
  col1Row1: {
    src: "/physio-aerobics.jpg",
    alt: "Aerobics and mobility on the floor",
  },
  col2Row1: {
    src: "/pn-aerobics.jpg",
    alt: "Group leg lifts on exercise mats",
  },
  col1Row2: {
    src: "/gr-aerobics.jpg",
    alt: "Step aerobics class",
  },
  col1Row3: {
    src: "/athlete-3.jpg",
    alt: "Step platform aerobics session",
  },
  col2Row3: {
    src: "/athlete-2.jpg",
    alt: "Squats with light weights in the gym",
  },
  col3Feature: {
    src: "/society-aerobics.jpg",
    alt: "Group aerobics with dumbbells",
  },
} as const;

export function GallerySplitFeatureSection() {
  const tile =
    "relative w-full overflow-hidden bg-gray-100 max-md:min-h-0 md:min-h-0 md:h-full";

  return (
    <section className="bg-white px-4 pb-5 md:pt-0">
      <div className="mx-auto w-full max-w-[min(90vw,1200px)]">
        <div className="relative my-10 flex items-center justify-center md:my-12">
          <div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary"
            aria-hidden
          />
          <div className="relative flex items-center gap-2 bg-white px-3 md:px-4">
            <Image
              src="/sparkle.svg"
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="text-center text-sm font-medium text-primary md:text-[15px]">
              Aerobics Classes Section
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:min-h-[min(85vw,640px)] md:grid-cols-[minmax(0,0.82fr)_minmax(0,0.82fr)_minmax(0,1.5fr)] md:grid-rows-3 md:gap-4 lg:min-h-[680px]">
          <div
            className={`${tile} max-md:order-1 max-md:aspect-square rounded-tl-[48px] rounded-br-[48px] rounded-tr-[18px] rounded-bl-[18px] md:order-none md:aspect-auto md:col-start-1 md:row-start-1 md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]`}
          >
            <Image
              src={aerobicsImages.col1Row1.src}
              alt={aerobicsImages.col1Row1.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 18vw, 45vw"
            />
          </div>
          <div
            className={`${tile} max-md:order-2 max-md:aspect-square rounded-tr-[48px] rounded-tl-[18px] rounded-bl-[48px] rounded-br-[18px] md:order-none md:aspect-auto md:col-start-2 md:row-start-1 md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]`}
          >
            <Image
              src={aerobicsImages.col2Row1.src}
              alt={aerobicsImages.col2Row1.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 18vw, 45vw"
            />
          </div>
          <div
            className={`${tile} max-md:order-3 max-md:aspect-square rounded-tl-[18px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[18px] md:order-none md:aspect-auto md:col-start-1 md:row-start-2 md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]`}
          >
            <Image
              src={aerobicsImages.col1Row2.src}
              alt={aerobicsImages.col1Row2.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 18vw, 45vw"
            />
          </div>
          <div
            className="hidden min-h-0 md:col-start-2 md:row-start-2 md:block"
            aria-hidden
          />
          <div
            className={`${tile} max-md:order-5 max-md:col-span-2 max-md:aspect-[16/10] rounded-tl-[18px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[18px] md:order-none md:col-span-1 md:aspect-auto md:col-start-1 md:row-start-3 md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]`}
          >
            <Image
              src={aerobicsImages.col1Row3.src}
              alt={aerobicsImages.col1Row3.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 18vw, 100vw"
            />
          </div>
          <div
            className={`${tile} max-md:order-4 max-md:aspect-square rounded-tr-[18px] rounded-tl-[48px] rounded-bl-[18px] rounded-br-[48px] md:order-none md:aspect-auto md:col-start-2 md:row-start-3 md:rounded-none md:rounded-tr-[72px] md:rounded-bl-[72px] md:rounded-tl-[24px] md:rounded-br-[24px]`}
          >
            <Image
              src={aerobicsImages.col2Row3.src}
              alt={aerobicsImages.col2Row3.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 18vw, 45vw"
            />
          </div>
          <div
            className={`relative w-full overflow-hidden bg-gray-100 max-md:order-6 max-md:col-span-2 max-md:aspect-[4/5] max-md:min-h-0 rounded-tr-[18px] rounded-tl-[48px] rounded-bl-[18px] rounded-br-[48px] md:order-none md:col-span-1 md:col-start-3 md:row-span-3 md:row-start-1 md:aspect-auto md:h-full md:rounded-none md:rounded-tl-[72px] md:rounded-br-[72px] md:rounded-tr-[24px] md:rounded-bl-[24px]`}
          >
            <Image
              src={aerobicsImages.col3Feature.src}
              alt={aerobicsImages.col3Feature.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 44vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
