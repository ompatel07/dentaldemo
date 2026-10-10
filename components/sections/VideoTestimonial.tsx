"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { site } from "@/content/site.config";
import type { Testimonial } from "@/content/types";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A portrait card that plays a muted loop on hover, when it has one.
 *
 * The video sits on top at zero opacity and only fades in once it is
 * genuinely playing, so a missing, slow or blocked clip leaves the poster
 * in place instead of flashing a black box. Only the two cards that have
 * video are client components; the rest of the carousel is static markup.
 */
export function VideoTestimonial({ item }: { item: Testimonial }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  if (!item.video) return null;
  const clip = item.video.preview;

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    if (prefersReducedMotion()) return;
    void v.play().catch(() => setPlaying(false));
  };

  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  return (
    <figure
      className="group/video relative h-full overflow-hidden rounded-[var(--r-lg)] bg-surface"
      onMouseEnter={play}
      onMouseLeave={stop}
      data-cursor-label={clip ? site.copy.playLabel : undefined}
    >
      <div className="relative h-full min-h-[320px]">
        <Image
          src={item.video.poster.src}
          alt={item.video.poster.alt}
          fill
          sizes="(max-width: 640px) 80vw, 26vw"
          className="object-cover"
          loading="lazy"
        />
        {clip ? (
        <video
          ref={videoRef}
          src={clip}
          /* No `poster` attribute on purpose. It bypasses next/image and
             eagerly downloads the full-size original - two unoptimised
             JPEGs competing with the hero image on first load. The poster
             underneath is a real next/image, and the video only becomes
             visible once it is playing anyway. */
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: playing ? 1 : 0 }}
          tabIndex={-1}
          aria-hidden="true"
        />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/95 via-[var(--ink)]/45 to-transparent" />

        <figcaption className="absolute inset-x-0 bottom-0 p-[clamp(1.25rem,2vw,1.75rem)]">
          <p className="text-sm text-[var(--coral)]">
            <span className="sr-only">Rated {item.rating} out of 5</span>
            <span aria-hidden="true">{"★".repeat(item.rating)}</span>
          </p>
          <blockquote className="mt-4 text-[var(--paper)]">{item.quote}</blockquote>
          <p className="mt-4 text-sm font-medium text-[var(--paper)]">
            {item.author} <span className="font-normal opacity-70">· {item.context}</span>
          </p>
        </figcaption>
      </div>
    </figure>
  );
}
