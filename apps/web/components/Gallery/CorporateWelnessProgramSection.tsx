"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type CategoryId =
  | "physiotherapy"
  | "aerobics"
  | "yoga"
  | "pilates"
  | "corporate";

type CategoryConfig = {
  id: CategoryId;
  label: string;
  sectionTitle: string;
  images: { src: string; alt: string }[];
};

const categories: CategoryConfig[] = [
  {
    id: "physiotherapy",
    label: "Physiotherapy",
    sectionTitle: "Physiotherapy Sessions Section",
    images: [
      { src: "/physio-1.jpg", alt: "Physiotherapy session on treatment table" },
      { src: "/physio-2.jpg", alt: "Therapeutic taping and back care" },
      { src: "/physio-3.jpg", alt: "Physiotherapy on exercise mat" },
      { src: "/physio-physio.jpg", alt: "Shoulder and mobility physiotherapy" },
      { src: "/physio-4.jpg", alt: "Lower limb stretching and rehab" },
    ],
  },
  {
    id: "aerobics",
    label: "Aerobics",
    sectionTitle: "Aerobics Sessions Section",
    images: [
      { src: "/physio-aerobics.jpg", alt: "Aerobics and cardio movement" },
      { src: "/society-aerobics.jpg", alt: "Group aerobics session" },
      { src: "/pn-aerobics.jpg", alt: "Energetic aerobics training" },
      { src: "/gr-aerobics.jpg", alt: "Senior-friendly aerobics" },
      { src: "/athlete-2.jpg", alt: "Athletic conditioning and aerobics" },
    ],
  },
  {
    id: "yoga",
    label: "Yoga",
    sectionTitle: "Yoga Sessions Section",
    images: [
      { src: "/physio-yoga.jpg", alt: "Yoga and flexibility session" },
      { src: "/society-yoga.jpg", alt: "Group yoga practice" },
      { src: "/pn-yoga.jpg", alt: "Prenatal and wellness yoga" },
      { src: "/gr-yoga.jpg", alt: "Gentle yoga for mobility" },
      { src: "/it-yoga.jpg", alt: "Yoga for strength and balance" },
    ],
  },
  {
    id: "pilates",
    label: "Pilates",
    sectionTitle: "Pilates Sessions Section",
    images: [
      { src: "/physio-pilates.jpg", alt: "Pilates core training" },
      { src: "/society-pilates.jpg", alt: "Group pilates session" },
      { src: "/pn-pilates.jpg", alt: "Pilates for stability" },
      { src: "/gr-pilates.jpg", alt: "Rehab-focused pilates" },
      { src: "/it-pilates.jpg", alt: "Pilates movement patterns" },
    ],
  },
  {
    id: "corporate",
    label: "Corporate Wellness",
    sectionTitle: "Corporate Wellness Sessions Section",
    images: [
      { src: "/cp-1.jpg", alt: "Corporate wellness and desk ergonomics" },
      { src: "/cp-2.jpg", alt: "Workplace movement and stretching" },
      { src: "/corporate-hero.png", alt: "Corporate wellness programs" },
      { src: "/it-common-challenges.jpg", alt: "Office posture and wellbeing" },
      { src: "/blog4.jpg", alt: "Team wellness activities" },
    ],
  },
];

export function CorporateWelnessProgramSection() {
  const [activeId, setActiveId] = useState<CategoryId>("physiotherapy");

  const active = useMemo(
    () => categories.find((c) => c.id === activeId) ?? categories[0],
    [activeId]
  );

  const [a, b, c, d, e] = active.images;

  return (
    <section className="bg-white px-4 pb-10 md:pb-20">
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
              Corporate Wellness Program Section
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="relative col-span-12 h-[50vh] w-full overflow-hidden md:col-span-3">
            
          </div>
          <div className="relative col-span-12 w-full overflow-hidden rounded-tr-[72px] rounded-bl-[72px] rounded-tl-[24px] rounded-br-[24px] bg-gray-100 md:col-span-5">
            <Image
              src={b.src}
              alt={b.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="relative col-span-12 w-full overflow-hidden rounded-tl-[72px] rounded-br-[72px] rounded-tr-[24px] rounded-bl-[24px] bg-gray-100 md:col-span-4">
            <Image
              src={c.src}
              alt={c.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
          </div>
          <div className="relative col-span-12 h-[50vh] w-full overflow-hidden rounded-tr-[72px] rounded-bl-[72px] rounded-tl-[24px] rounded-br-[24px] bg-gray-100 md:col-span-5">
            <Image
              src={d.src}
              alt={d.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="relative col-span-12 w-full overflow-hidden rounded-tl-[72px] rounded-br-[72px] rounded-tr-[24px] rounded-bl-[24px] bg-gray-100 md:col-span-4">
            <Image
              src={e.src}
              alt={e.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="relative col-span-12 w-full overflow-hidden rounded-tr-[72px] rounded-bl-[72px] rounded-tl-[24px] rounded-br-[24px] bg-gray-100 md:col-span-3">
            <Image
              src={b.src}
              alt={b.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
