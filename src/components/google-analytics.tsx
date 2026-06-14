"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Gtag = (...args: unknown[]) => void;

/**
 * GA4 via gtag.js. The initial page_view is sent by gtag('config'); this
 * component sends a page_view on subsequent App Router navigations.
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // config already counted the first view
      return;
    }
    const w = window as unknown as { gtag?: Gtag };
    w.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
