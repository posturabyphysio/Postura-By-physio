"use client";

import type { CSSProperties, ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

function renderWithBr(value: ReactNode) {
  if (typeof value !== "string") return value;
  const parts = value.split(/<br\s*\/?>/gi);
  if (parts.length === 1) return value;
  return parts.map((part, idx) => (
    <Fragment key={idx}>
      {part}
      {idx < parts.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

export type ApproachStep = {
  key: string;
  title: string;
  /** Desktop placement (matches current design). */
  position?: "top" | "bottom";
};

export type OurApproachTimelineProps = {
  id?: string;
  className?: string;
  backgroundClassName?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  steps: ApproachStep[];
};

/** Main dot drifts smoothly along the full line (desktop L→R, mobile T→B) */
const CARRIER_TOTAL_MS = 11000;
/** Flying dot from junction → ring dot */
const PEEL_MS = 1200;
/** Match peel transform end before clearing flying dot */
const PEEL_SETTLE_MS = 70;
/** Pause after full cycle before restarting from step 1 */
const CYCLE_PAUSE_MS = 1700;

function columnCenterPct(idx: number, n: number) {
  if (n <= 0) return 0;
  return ((idx + 0.5) / n) * 100;
}

/** Time when linear carrier crosses column `idx` centre (matches CSS animation) */
function junctionArrivalMs(idx: number, n: number) {
  if (n <= 0) return 0;
  return CARRIER_TOTAL_MS * ((idx + 0.5) / n);
}

export function OurApproachTimeline({
  id = "our-approach",
  className,
  backgroundClassName = "bg-white",
  eyebrow = "How it Works",
  title = (
    <>
      Our Approach to
      <br /> Physiotherapy
    </>
  ),
  description = (
    <>
      A structured and progressive rehabilitation
      <br />
      process designed for complete recovery.
    </>
  ),
  steps,
}: OurApproachTimelineProps) {
  const n = steps.length;
  const gridColsStyle: CSSProperties =
    n > 0 ? { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` } : {};

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /**
   * Remount carrier so linear drift restarts in sync with peel timers.
   * 0 = idle until first cycle arms (avoids animation/timer desync on mount).
   */
  const [motionCycleKey, setMotionCycleKey] = useState(0);

  const [peelingIdx, setPeelingIdx] = useState<number | null>(null);
  const [peelAnimOn, setPeelAnimOn] = useState(false);
  /** Steps whose ring keeps pinging until this interval ends */
  const [pingingSteps, setPingingSteps] = useState<number[]>([]);

  useEffect(() => {
    if (n === 0 || reducedMotion) return;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    /** Wait long enough for carrier + last peel to finish (handles large step counts) */
    const cycleMotionMs =
      n > 0
        ? Math.max(
            CARRIER_TOTAL_MS,
            junctionArrivalMs(n - 1, n) + PEEL_MS + PEEL_SETTLE_MS + 100,
          )
        : CARRIER_TOTAL_MS;

    let cancelled = false;
    const peelTimeouts: number[] = [];

    const clearPeelTimeouts = () => {
      peelTimeouts.splice(0).forEach((id) => window.clearTimeout(id));
    };

    const schedulePeelsForCycle = () => {
      for (let i = 0; i < n; i++) {
        const arrival = junctionArrivalMs(i, n);
        peelTimeouts.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setPeelingIdx(i);
            peelTimeouts.push(
              window.setTimeout(() => {
                if (cancelled) return;
                setPeelingIdx(null);
                setPingingSteps((prev) => (prev.includes(i) ? prev : [...prev, i]));
              }, PEEL_MS + PEEL_SETTLE_MS),
            );
          }, arrival),
        );
      }
    };

    const run = async () => {
      await wait(350);
      while (!cancelled) {
        clearPeelTimeouts();
        setPeelingIdx(null);
        setPingingSteps([]);
        setMotionCycleKey((k) => k + 1);
        await wait(48);
        if (cancelled) break;

        schedulePeelsForCycle();

        await wait(cycleMotionMs);
        if (cancelled) break;

        clearPeelTimeouts();
        setPeelingIdx(null);

        await wait(CYCLE_PAUSE_MS);
      }
    };

    run();

    return () => {
      cancelled = true;
      clearPeelTimeouts();
    };
  }, [n, reducedMotion]);

  useEffect(() => {
    if (peelingIdx === null) {
      setPeelAnimOn(false);
      return;
    }
    setPeelAnimOn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPeelAnimOn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [peelingIdx]);

  const flyingPeelTransition: CSSProperties = {
    transition: `transform ${PEEL_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
  };

  return (
    <section id={id} className={cn(backgroundClassName, className)}>
      <div className="mx-auto max-w-[90vw] px-4 pt-16 md:pt-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <FadeIn direction="up" distance={28} duration={800} delay={0}>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-sm font-medium md:justify-start">
                <Image src="/sparkle.svg" alt="" width={16} height={16} className="h-4 w-4" />
                <span className="text-primary">{eyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={28} duration={800} delay={100}>
            <div className="space-y-4 text-center text-sm leading-7 text-gray-500 md:text-left">
              <p>{renderWithBr(description)}</p>
            </div>
          </FadeIn>
        </div>

        {/* ── Mobile: vertical timeline ─────────────────────────────────── */}
        <div className="relative mt-10 pb-10 md:hidden">
          {/* vertical dashed line */}
          <div
            aria-hidden
            className="timeline-dash timeline-dash--v timeline-dash--loop absolute bottom-2 left-10 top-2 w-1 -translate-x-1/2"
          />

          {/* Sequential carrier + peel (hidden when reduced motion) */}
          {!reducedMotion && motionCycleKey > 0 ? (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-2 left-10 top-2 z-[14] w-0 -translate-x-1/2"
            >
              <div
                key={motionCycleKey}
                className="approach-carrier-drift-v absolute left-1/2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.95)]"
                style={{ animationDuration: `${CARRIER_TOTAL_MS}ms` }}
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
            </div>
          ) : null}

          <div className="space-y-10">
            {steps.map((step, idx) => (
              <div key={step.key} className="relative pl-40">
                {/* intersection dot on dashed line (static) */}
                <div className="absolute left-10 top-9 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary" />
                {/* connector from line to step marker */}
                <div className="absolute left-10 top-10 z-0 h-px w-28 bg-primary" />
                {/* ring dot at end of connector */}
                <div className="absolute left-36 top-10 z-10 flex h-4 w-4 items-center justify-center overflow-visible rounded-full border-2 border-primary bg-white">
                  {!reducedMotion && pingingSteps.includes(idx) ? (
                    <>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/50 [animation-duration:0.95s]"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/35 [animation-delay:220ms] [animation-duration:1.65s]"
                      />
                    </>
                  ) : null}
                  <div className="relative z-10 h-2 w-2 rounded-full bg-primary" />
                </div>

                {/* Flying peel: only for active step, sequential */}
                {!reducedMotion && peelingIdx === idx ? (
                  <div
                    aria-hidden
                    className="absolute left-10 top-9 z-[16] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(255,255,255,0.92)]"
                    style={{
                      ...flyingPeelTransition,
                      transform: peelAnimOn
                        ? "translate(-50%, -50%) translateX(7rem)"
                        : "translate(-50%, -50%) translateX(0)",
                    }}
                  />
                ) : null}

                {/* step label */}
                <div className="pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0]">
                    {step.key}
                  </div>
                  <div className="mt-3 text-base font-semibold text-slate-900">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop: horizontal timeline ──────────────────────────────── */}
        <div className="relative mt-48 hidden md:block">
          <div
            aria-hidden
            className="timeline-dash timeline-dash--h timeline-dash--loop absolute left-0 right-0 top-1/2 z-0 h-1 -translate-y-1/2"
          />

          {/* Sequential carrier → peel → ring ping (hidden when reduced motion) */}
          {!reducedMotion && motionCycleKey > 0 ? (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-[25] overflow-visible">
              <div className="absolute left-0 right-0 top-1/2 h-0">
                <div
                  key={motionCycleKey}
                  className="approach-carrier-drift-h absolute top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.95)]"
                  style={{ animationDuration: `${CARRIER_TOTAL_MS}ms` }}
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
              </div>
              {peelingIdx !== null ? (
                <div
                  className="absolute top-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(255,255,255,0.92)]"
                  style={{
                    left: `${columnCenterPct(peelingIdx, n)}%`,
                    ...flyingPeelTransition,
                    transform: peelAnimOn
                      ? (steps[peelingIdx]?.position ?? "top") === "top"
                        ? "translate(-50%, calc(-50% - 5rem))"
                        : "translate(-50%, calc(-50% + 5rem))"
                      : "translate(-50%, -50%)",
                  }}
                />
              ) : null}
            </div>
          ) : null}

          <div className="relative z-10 grid" style={gridColsStyle}>
            {steps.map((step, idx) => {
              const isTop = (step.position ?? "top") === "top";
              return (
                <div key={step.key} className="relative flex flex-col items-center">
                  {/* centre dot on the line (static) */}
                  <div className="absolute left-1/2 top-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />

                  {/* vertical connector */}
                  <div
                    className={cn(
                      "absolute left-1/2 z-10 w-px -translate-x-1/2 bg-primary",
                      isTop
                        ? "top-[calc(50%-1px)] h-20 -translate-y-full"
                        : "top-[calc(50%+1px)] h-20",
                    )}
                  />

                  {/* ring dot at end of connector */}
                  <div
                    className={cn(
                      "absolute left-1/2 z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-visible rounded-full border-2 border-primary bg-white",
                      isTop
                        ? "top-[calc(50%-5rem)] -translate-y-1/2"
                        : "top-[calc(50%+5rem)] -translate-y-1/2",
                    )}
                  >
                    {!reducedMotion && pingingSteps.includes(idx) ? (
                      <>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/50 [animation-duration:0.95s]"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-0 animate-ping rounded-full bg-primary/35 [animation-delay:220ms] [animation-duration:1.65s]"
                        />
                      </>
                    ) : null}
                    <div className="relative z-10 h-2 w-2 rounded-full bg-primary" />
                  </div>

                  {/* step content */}
                  <div
                    className={cn(
                      "flex flex-col items-center",
                      isTop ? "-translate-y-[8.75rem]" : "translate-y-[8.75rem]",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-[#FEF9E0]">
                      {step.key}
                    </div>
                    <div className="mt-3 text-center text-md font-semibold text-slate-900">
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Local styles: looping dashed line + continuous carrier drift */}
      <style jsx>{`
        .approach-carrier-drift-h {
          left: 0%;
          top: 0;
          transform: translate(-50%, -50%);
          animation-name: approachCarrierDriftH;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-iteration-count: 1;
          will-change: left;
        }
        @keyframes approachCarrierDriftH {
          from {
            left: 0%;
            transform: translate(-50%, -50%);
          }
          to {
            left: 100%;
            transform: translate(-50%, -50%);
          }
        }

        .approach-carrier-drift-v {
          left: 50%;
          top: 0%;
          transform: translate(-50%, 0);
          animation-name: approachCarrierDriftV;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-iteration-count: 1;
          will-change: top;
        }
        @keyframes approachCarrierDriftV {
          from {
            top: 0%;
            transform: translate(-50%, 0);
          }
          to {
            top: 100%;
            transform: translate(-50%, -100%);
          }
        }

        .timeline-dash {
          --dash: #d9d9d9;
          --gap: transparent;
          --dashSize: 12px;
          --gapSize: 10px;
        }
        .timeline-dash--v {
          background-image: repeating-linear-gradient(
            to bottom,
            var(--dash) 0,
            var(--dash) var(--dashSize),
            var(--gap) var(--dashSize),
            var(--gap) calc(var(--dashSize) + var(--gapSize))
          );
          background-size: 100% calc(var(--dashSize) + var(--gapSize));
          background-position: 0 0;
        }
        .timeline-dash--h {
          background-image: repeating-linear-gradient(
            to right,
            var(--dash) 0,
            var(--dash) var(--dashSize),
            var(--gap) var(--dashSize),
            var(--gap) calc(var(--dashSize) + var(--gapSize))
          );
          background-size: calc(var(--dashSize) + var(--gapSize)) 100%;
          background-position: 0 0;
        }
        .timeline-dash--loop.timeline-dash--v {
          animation: timelineDashV 1.4s linear infinite;
        }
        .timeline-dash--loop.timeline-dash--h {
          animation: timelineDashH 1.4s linear infinite;
        }
        @keyframes timelineDashV {
          to {
            background-position: 0 calc(var(--dashSize) + var(--gapSize));
          }
        }
        @keyframes timelineDashH {
          to {
            background-position: calc(var(--dashSize) + var(--gapSize)) 0;
          }
        }
      `}</style>
    </section>
  );
}
