"use client";

import Image from "next/image";
import { useState } from "react";
import { useInView } from "../../hooks/useInView";

export type GalleryTile = { src: string; alt: string };

const FALLBACK_WIDTH = 4;
const FALLBACK_HEIGHT = 5;

function getInitialTransform(
  direction: "up" | "down" | "left" | "right" | "none",
  distance: number,
): string {
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
}

/**
 * Gallery tile sized from the image's natural aspect ratio (no cropping).
 * Returns null when no image is provided.
 */
export function GalleryIntrinsicTile({
  tile,
  className = "",
  sizes,
  fadeDelayMs = 0,
  animate = true,
}: {
  tile: GalleryTile | undefined;
  className?: string;
  sizes: string;
  fadeDelayMs?: number;
  animate?: boolean;
  missingLabel?: string;
}) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const tileInView = useInView({ threshold: 0.12 });

  if (!tile) return null;

  const aspectRatio = dimensions
    ? `${dimensions.width} / ${dimensions.height}`
    : `${FALLBACK_WIDTH} / ${FALLBACK_HEIGHT}`;

  const animationStyle = animate
    ? {
        opacity: tileInView.isInView ? 1 : 0,
        transform: tileInView.isInView
          ? "translate(0,0)"
          : getInitialTransform("up", 22),
        transition:
          "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${fadeDelayMs}ms`,
      }
    : undefined;

  return (
    <div
      ref={animate ? tileInView.ref : undefined}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio, ...animationStyle }}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        width={dimensions?.width ?? FALLBACK_WIDTH * 200}
        height={dimensions?.height ?? FALLBACK_HEIGHT * 200}
        onLoad={(e) => {
          const img = e.currentTarget;
          setDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }}
        className="h-auto w-full"
        sizes={sizes}
      />
    </div>
  );
}
