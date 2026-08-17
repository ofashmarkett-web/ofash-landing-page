"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Crossfades through a category's photos. The first image is always
 * rendered opaque so the tile is never blank before JS starts.
 */
export function CategoryCarousel({
  images,
  alt,
  interval = 6500,
}: {
  images: string[];
  alt: string;
  interval?: number;
}) {
  const [i, setI] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still || images.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval, still]);

  return (
    <>
      {images.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={idx === 0 ? alt : ""}
          aria-hidden={idx !== 0}
          fill
          sizes="(max-width: 620px) 100vw, (max-width: 1000px) 45vw, 340px"
          className="zoom-img"
          style={{
            objectFit: "cover",
            objectPosition: "center 25%",
            opacity: idx === i ? 1 : 0,
            transition: "opacity 1s ease-in-out, transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ))}
    </>
  );
}
