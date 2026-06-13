"use client";

import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { hosts } from "@/lib/data";
import { HOST_COORDS } from "@/lib/host-coords";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function HostMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!TOKEN || !container) return;

    let map: any;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !container) return;

      mapboxgl.accessToken = TOKEN;
      map = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [3, 47],
        zoom: 3.3,
        cooperativeGestures: true,
        attributionControl: true,
      });
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right",
      );

      const bounds = new mapboxgl.LngLatBounds();
      hosts.forEach((h) => {
        const coords = HOST_COORDS[h.id];
        if (!coords) return;
        const popup = new mapboxgl.Popup({
          offset: 22,
          closeButton: false,
        }).setHTML(
          `<div style="font-family:inherit;max-width:210px;padding:2px">
             <div style="font-weight:600;color:#2a2620;font-size:14px">${h.name}</div>
             <div style="font-size:12px;color:#4f4a40;margin-top:2px">${h.location.place}, ${h.location.country}</div>
             <div style="font-size:12px;color:#4f4a40">${h.landType}</div>
             <a href="/hosts/${h.slug}" style="display:inline-block;margin-top:7px;font-size:12px;font-weight:600;color:#3f5e3a;text-decoration:none">View host &rarr;</a>
           </div>`,
        );
        new mapboxgl.Marker({ color: "#3f5e3a" })
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map);
        bounds.extend(coords);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 64, maxZoom: 6.5, duration: 0 });
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  if (!TOKEN) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-stone-soft bg-paper/50 p-8 text-center text-sm text-bark-soft">
        Set <code className="mx-1 rounded bg-cream px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
        to enable the map.
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
