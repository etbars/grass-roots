"use client";

import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/** A small, static location map with a single pin for a host profile. */
export function HostMiniMap({
  lng,
  lat,
  name,
}: {
  lng: number;
  lat: number;
  name: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!TOKEN || !container) return;
    let cancelled = false;
    let map: any;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !container) return;
      mapboxgl.accessToken = TOKEN;
      map = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [lng, lat],
        zoom: 6.5,
        interactive: false,
      });
      new mapboxgl.Marker({ color: "#bf6a43" }).setLngLat([lng, lat]).addTo(map);
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [lng, lat]);

  if (!TOKEN) return null;
  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-label={`Map showing ${name}`}
    />
  );
}
