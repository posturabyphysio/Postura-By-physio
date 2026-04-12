"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { cn } from "../../lib/utils";

export type SpecializedProgramSlide = {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
};

export type SpecializedProgramsCarouselProps = {
  id?: string;
  className?: string;
  eyebrow?: string;
  showSparkle?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  slides?: SpecializedProgramSlide[];
};

const defaultSlides: SpecializedProgramSlide[] = [
  {
    title: "Pre & Post Natal Care",
    subtitle: "Strong recovery. Confident mother.",
    imageSrc: "/wcju-3.jpg",
    href: "/pre-post-natal",
  },
  {
    title: "Corporate / IT Employees",
    subtitle: "Better posture. Better performance.",
    imageSrc: "/wcju-1.jpg",
    href: "/corporate-professionals",
  },
  {
    title: "Middle-Aged Women",
    subtitle: "Life feels better together.",
    imageSrc: "/society-aerobics.jpg",
    href: "/society-exercise",
  },
  {
    title: "Geriatric Rehabilitation",
    subtitle: "Stay steady. Stay independent.",
    imageSrc: "/wcju-4.jpg",
    href: "/geriatric-rehabilitation",
  },
  {
    title: "Physiotherapy Services",
    subtitle: "From pain to progress.",
    imageSrc: "/wcju-5.jpg",
    href: "/physiotherapy-management",
  },
  {
    title: "Prehab for Fitness Lovers",
    subtitle: "Train smart. Prevent injuries.",
    imageSrc: "/wcju-6.jpg",
    href: "/athlete-rehab",
  },
];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getSlotStyle(
  slideIdx: number,
  currentIdx: number,
  total: number,
): CSSProperties {
  const diff = mod(slideIdx - currentIdx, total);

  if (diff === 0) {
    return {
      left: "50%",
      transform: "translate(-50%, -50%) rotateY(0deg) scale(1)",
      zIndex: 30,
      opacity: 1,
    };
  }
  if (diff === total - 1) {
    return {
      left: "18%",
      transform: "translate(-50%, -50%) rotateY(30deg) scale(0.88)",
      zIndex: 15,
      opacity: 1,
    };
  }
  if (diff === 1) {
    return {
      left: "82%",
      transform: "translate(-50%, -50%) rotateY(-30deg) scale(0.88)",
      zIndex: 15,
      opacity: 1,
    };
  }
  const goRight = diff <= Math.floor(total / 2);
  return {
    left: goRight ? "120%" : "-20%",
    transform: `translate(-50%, -50%) rotateY(${goRight ? "-50" : "50"}deg) scale(0.6)`,
    zIndex: 0,
    opacity: 0,
    pointerEvents: "none",
  };
}

function CarouselCard({
  slide,
  style,
  isCenter,
}: {
  slide: SpecializedProgramSlide;
  style: CSSProperties;
  isCenter: boolean;
}) {
  return (
    <div
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className={cn(
          "transition-[width] duration-700",
          isCenter
            ? "w-[280px] md:w-[380px] lg:w-[460px]"
            : "w-[220px] md:w-[300px] lg:w-[360px]",
        )}
      >
        <Link
          href={slide.href}
          className="group block"
          tabIndex={isCenter ? 0 : -1}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.2rem] shadow-[0_20px_50px_rgba(15,23,42,0.18)] ring-1 ring-black/5 md:rounded-[1.5rem]">
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 280px, 460px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-primary/5" />

            {!isCenter ? (
              <div className="absolute inset-0 bg-white/30 transition-opacity duration-700" />
            ) : null}

            <div
              className="pointer-events-none absolute inset-3 rounded-[0.9rem] border border-white/60 md:inset-4 md:rounded-[1.1rem]"
              aria-hidden
            />

            <div className="absolute right-3 top-3 z-10 md:right-4 md:top-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-white shadow-md md:h-10 md:w-10">
                <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={2.5} />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6">
              <h3 className="text-sm font-bold leading-tight md:text-lg">{slide.title}</h3>
              <p className="mt-1 text-[11px] text-white/85 md:text-sm">{slide.subtitle}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function SpecializedProgramsCarousel({
  id = "specialized-programs",
  className,
  eyebrow = "Specialized Programs",
  showSparkle = true,
  title = "Specialized Programs for Every Need",
  description = "Targeted solutions designed for specific health conditions and lifestyle requirements.",
  slides = defaultSlides,
}: SpecializedProgramsCarouselProps) {
  const len = slides.length;
  const [index, setIndex] = useState(0);

  const goPrev = useCallback(() => {
    setIndex((i) => mod(i - 1, len));
  }, [len]);

  const goNext = useCallback(() => {
    setIndex((i) => mod(i + 1, len));
  }, [len]);

  const progress = len <= 1 ? 0.5 : index / (len - 1);
  const RX = 240;
  const RY = 18;
  const CX = 250;
  const CY = 24;
  const ellipseAngle = Math.PI * (1 - progress);
  const dotCx = CX + RX * Math.cos(ellipseAngle);
  const dotCy = CY - RY * Math.sin(ellipseAngle);

  const cardStyles = useMemo(
    () => slides.map((_, i) => getSlotStyle(i, index, len)),
    [index, len, slides],
  );

  return (
    <section id={id} className={cn("bg-white py-5 md:py-10", className)}>
      <div className="mx-auto max-w-[90vw] md:px-4">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-[1.1fr,1fr] md:items-end md:gap-10 lg:grid-cols-[1.15fr,0.95fr]">
          <FadeIn direction="up" duration={800} distance={28} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-primary md:justify-start">
                {showSparkle ? (
                  <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                ) : null}
                <span>{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={800} distance={28} delay={100} className="md:justify-self-end">
            <div className="text-center text-sm leading-7 text-gray-500 md:text-left md:text-base">
              {description}
            </div>
          </FadeIn>
        </div>

        {/* Carousel viewport */}
        <div className="mt-12 overflow-hidden md:mt-16" style={{ perspective: "1200px" }}>
          <div
            className="relative mx-auto h-[240px] max-w-5xl md:h-[310px] lg:h-[370px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {slides.map((slide, i) => (
              <CarouselCard
                key={i}
                slide={slide}
                style={cardStyles[i]!}
                isCenter={mod(i - index, len) === 0}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between gap-4 md:mt-12">
          <button
            type="button"
            onClick={goPrev}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-secondary text-secondary transition hover:bg-secondary/10 md:h-12 md:w-12"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <svg
            viewBox="0 0 500 48"
            className="mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg"
            role="presentation"
            aria-hidden="true"
          >
            {/* Back half of the ellipse (behind the dot) with white fill for 3D depth */}
            <path
              d={`M ${CX - RX} ${CY} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CY}`}
              fill="none"
              stroke="var(--color-primary, #2A7A7A)"
              strokeWidth={1.3}
              opacity={0.18}
            />
            {/* White opacity wash on the back arc for 3D effect */}
            <ellipse
              cx={CX}
              cy={CY + 2}
              rx={RX - 10}
              ry={RY - 4}
              fill="white"
              opacity={0.5}
            />
            {/* Front half of the ellipse (in front of the dot) */}
            <path
              d={`M ${CX - RX} ${CY} A ${RX} ${RY} 0 0 1 ${CX + RX} ${CY}`}
              fill="none"
              stroke="var(--color-primary, #2A7A7A)"
              strokeWidth={1.5}
              opacity={0.4}
            />
            {/* Animated dot */}
            <circle
              cx={dotCx}
              cy={dotCy}
              r={7.5}
              fill="var(--color-primary, #2A7A7A)"
              style={{ transition: "cx 0.7s cubic-bezier(0.4,0,0.2,1), cy 0.7s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>

          <button
            type="button"
            onClick={goNext}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-white shadow-sm transition hover:brightness-90 md:h-12 md:w-12"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </section>
  );
}

export const defaultSpecializedProgramSlides = defaultSlides;
