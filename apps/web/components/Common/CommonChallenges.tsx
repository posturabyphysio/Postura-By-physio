import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";
import { CheckCheckIcon } from "lucide-react";

export type CommonChallengesImage = {
  src: string;
  alt: string;
};

export type CommonChallengesProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  image?: CommonChallengesImage;
  watermarkSrc?: string;
};

export function CommonChallenges({
  eyebrow = "Common Challenges",
  title = "Workplace Health Challenges for IT Professionals",
  description = "Sedentary work routines and repetitive tasks often cause pain, stiffness, and fatigue. Our clinically guided wellness programs help reduce discomfort, improve mobility, and enhance daily performance.",
  bullets = [
    "Prolonged sitting leading to neck, shoulder, and lower back pain",
    "Poor posture causing muscle imbalance and stiffness",
    "Reduced physical activity leading to low stamina and weight gain",
    "Workplace stress affecting mental and physical well-being",
    "Repetitive strain injuries from continuous typing or screen use",
  ],
  image = { src: "/it-common-challenges.jpg", alt: "Physiotherapy session" },
  watermarkSrc = "/logo-svg.png",
}: CommonChallengesProps) {
  return (
    <section id="common-challenges" className="bg-white">
      <div className="mx-auto max-w-[90vw] py-12 md:px-4 md:py-10">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* Left image */}
          <FadeIn direction="right" duration={900} distance={60} delay={120}>
            <div className="relative md:pl-16">
              <div className="relative overflow-hidden rounded-bl-xl rounded-tl-[84px] rounded-br-[84px] rounded-tr-xl bg-gray-100 md:w-[32vw]">
                <div className="relative h-[52vh] w-full md:h-[68vh]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 40vw, 90vw"
                    priority={false}
                  />
                </div>
              </div>

              {/* Watermark overlay */}
              <div className="pointer-events-none absolute -left-6 bottom-0 md:left-6">
                <Image
                  src={watermarkSrc}
                  alt=""
                  width={190}
                  height={320}
                  className="h-auto w-[150px] opacity-60 md:w-[220px]"
                />
              </div>
            </div>
          </FadeIn>

          {/* Right content */}
          <div className="max-w-xl text-center md:text-left">
            <FadeIn direction="up" duration={800} distance={30} delay={140}>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 md:justify-start">
                <Image
                  src="/sparkle.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="text-primary">{eyebrow}</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={220}>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {title}
              </h2>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={320}>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </FadeIn>

            <FadeIn direction="up" duration={800} distance={30} delay={420}>
              <ul className="mt-6 space-y-3 text-left text-sm text-gray-600 md:mt-7">
                {bullets.map((b, idx) => (
                  <li key={`${idx}-${b}`} className="flex gap-3">
                    <span
                      className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary"
                      aria-hidden="true"
                    >
                      <CheckCheckIcon className="h-4 w-4 text-white" />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

