"use client";

import { useEffect, useState } from "react";

const VIDEO_ID = "QwyHIoqgTrc";
const SRC =
  `https://www.youtube-nocookie.com/embed/${VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&showinfo=0` +
  `&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&start=24`;

// How long the branded panel holds before it dissolves to the video (ms).
const HOLD = 2600;

/**
 * Hero background video with a branded intro reveal. A bark panel carrying the
 * Grass Roots mark animates in and holds, covering the brief YouTube
 * play-button flash entirely, then dissolves: the panel fades and lifts while
 * the video behind it un-blurs and brightens into view. Reduced-motion users
 * skip the intro. The panel covers the flash for the whole hold, so no player
 * API is needed; muted autoplay is reliably running by the time it clears.
 */
export function HeroVideo() {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduce(true);
      setRevealed(true);
      return;
    }
    // Next frame: trigger the logo entrance. Then hold, then dissolve.
    const raf = requestAnimationFrame(() => setMounted(true));
    const t = setTimeout(() => setRevealed(true), HOLD);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      {/* video backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <iframe
          title="A cob house, built start to finish"
          src={SRC}
          allow="autoplay; encrypted-media; picture-in-picture"
          aria-hidden="true"
          tabIndex={-1}
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-150 ${
            reduce ? "" : "transition-[filter] duration-[1300ms] ease-out"
          } ${revealed ? "blur-0 brightness-100" : "blur-xl brightness-[0.6]"}`}
        />
        {/* readability overlays, for text contrast after the reveal */}
        <div className="absolute inset-0 bg-bark/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/35 to-bark/55" />
      </div>

      {/* branded intro panel: holds, then dissolves to reveal the hero */}
      {!reduce && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-bark transition-[opacity,transform] duration-[1300ms] ease-in-out ${
            revealed ? "pointer-events-none scale-105 opacity-0" : "opacity-100"
          }`}
        >
          {/* subtle depth in the panel */}
          <div className="absolute inset-0 bg-gradient-to-br from-moss-deep/30 via-transparent to-clay/20" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/grass-roots-logo-light.svg"
            alt=""
            className={`relative h-24 w-auto px-6 transition-all ease-out sm:h-32 ${
              revealed
                ? "scale-110 opacity-0 blur-sm duration-[1100ms]"
                : mounted
                  ? "scale-100 opacity-100 blur-0 duration-[800ms]"
                  : "scale-90 opacity-0 blur-sm"
            }`}
          />
        </div>
      )}
    </>
  );
}
