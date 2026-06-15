"use client";

import { useEffect, useRef, useState } from "react";

// Minimal shape of the YouTube IFrame API surface we use.
interface YTPlayer {
  destroy?: () => void;
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: unknown) => YTPlayer;
  PlayerState: { PLAYING: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const VIDEO_ID = "QwyHIoqgTrc";
const SRC =
  `https://www.youtube-nocookie.com/embed/${VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&showinfo=0` +
  `&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1` +
  `&start=24&enablejsapi=1`;

/**
 * Hero background video with a "frosted dissolve" reveal. An earthy, blurred
 * plate covers the embed at load so the brief YouTube play-button flash is
 * never seen; the moment the player reports PLAYING (the button is gone), the
 * frost dissolves: the video un-blurs, brightens, and the tint fades out.
 * A fallback timer guarantees the frost always clears, and reduced-motion
 * users skip the animation.
 */
export function HeroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    let player: YTPlayer | undefined;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setRevealed(true);
    };

    // Safety net: never leave the hero frosted, even if the API is blocked.
    const fallback = setTimeout(reveal, 2500);

    const createPlayer = () => {
      const YT = window.YT;
      if (!YT || !iframeRef.current) return;
      player = new YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e: { data: number }) => {
            // A short beat after PLAYING so the first frames are painted.
            if (e.data === YT.PlayerState.PLAYING) setTimeout(reveal, 250);
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (
        !document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]',
        )
      ) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
    }

    return () => {
      clearTimeout(fallback);
      try {
        player?.destroy?.();
      } catch {
        /* player may already be gone */
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <iframe
        ref={iframeRef}
        id="hero-video"
        title="A cob house, built start to finish"
        src={SRC}
        allow="autoplay; encrypted-media; picture-in-picture"
        aria-hidden="true"
        tabIndex={-1}
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-150 transition-[filter] duration-[1100ms] ease-out ${
          revealed ? "blur-0 brightness-100" : "blur-2xl brightness-[0.55]"
        }`}
      />

      {/* readability overlays, kept for text contrast after the reveal */}
      <div className="absolute inset-0 bg-bark/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/35 to-bark/55" />

      {/* frosted plate: hides the play-button flash, then dissolves away */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-bark via-bark/85 to-moss-deep/80 transition-opacity duration-[1100ms] ease-out ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
