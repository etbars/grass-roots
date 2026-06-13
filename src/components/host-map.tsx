"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { hosts, getCoursesByHost, categories } from "@/lib/data";
import { HOST_COORDS } from "@/lib/host-coords";
import { cn } from "@/lib/utils";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Each host as a GeoJSON point, tagged with the crafts it hosts.
const FEATURES = hosts
  .filter((h) => HOST_COORDS[h.id])
  .map((h) => ({
    type: "Feature" as const,
    geometry: { type: "Point" as const, coordinates: HOST_COORDS[h.id] },
    properties: {
      name: h.name,
      slug: h.slug,
      place: h.location.place,
      country: h.location.country,
      landType: h.landType,
      cats: Array.from(
        new Set(getCoursesByHost(h.id).map((c) => c.categoryId)),
      ).join(","),
    },
  }));

function collection(catId: string | null) {
  const features = catId
    ? FEATURES.filter((f) => f.properties.cats.split(",").includes(catId))
    : FEATURES;
  return { type: "FeatureCollection" as const, features };
}

export function HostMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!TOKEN || !container) return;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !container) return;
      mapboxgl.accessToken = TOKEN;
      // Typed loosely: mapbox-gl v3's layer/expression types are very strict
      // and reject otherwise-valid cluster paint expressions.
      const map: any = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [3, 47],
        zoom: 3.3,
        cooperativeGestures: true,
      });
      mapRef.current = map;
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right",
      );

      map.on("load", () => {
        map.addSource("hosts", {
          type: "geojson",
          data: collection(null),
          cluster: true,
          clusterMaxZoom: 6,
          clusterRadius: 44,
        });
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "hosts",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#3f5e3a",
            "circle-radius": ["step", ["get", "point_count"], 15, 3, 19, 6, 24],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#f5f1e6",
          },
        });
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "hosts",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 13,
          },
          paint: { "text-color": "#fdfbf4" },
        });
        map.addLayer({
          id: "points",
          type: "circle",
          source: "hosts",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#bf6a43",
            "circle-radius": 8,
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#f5f1e6",
          },
        });

        const bounds = new mapboxgl.LngLatBounds();
        FEATURES.forEach((f) =>
          bounds.extend(f.geometry.coordinates as [number, number]),
        );
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 60, maxZoom: 6.5, duration: 0 });
        }

        map.on("click", "clusters", async (e: any) => {
          const feats = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = feats[0]?.properties?.cluster_id;
          const src: any = map.getSource("hosts");
          try {
            const zoom = await src.getClusterExpansionZoom(clusterId);
            map.easeTo({ center: feats[0].geometry.coordinates, zoom });
          } catch {
            // ignore
          }
        });

        map.on("click", "points", (e: any) => {
          const f = e.features[0];
          const p = f.properties;
          const coords = f.geometry.coordinates.slice();
          new mapboxgl.Popup({ offset: 14, closeButton: false })
            .setLngLat(coords)
            .setHTML(
              `<div style="font-family:inherit;max-width:210px;padding:2px">
                 <div style="font-weight:600;color:#2a2620;font-size:14px">${p.name}</div>
                 <div style="font-size:12px;color:#4f4a40;margin-top:2px">${p.place}, ${p.country}</div>
                 <div style="font-size:12px;color:#4f4a40">${p.landType}</div>
                 <a href="/hosts/${p.slug}" style="display:inline-block;margin-top:7px;font-size:12px;font-weight:600;color:#3f5e3a;text-decoration:none">View host &rarr;</a>
               </div>`,
            )
            .addTo(map);
        });

        ["clusters", "points"].forEach((layer) => {
          map.on("mouseenter", layer, () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", layer, () => {
            map.getCanvas().style.cursor = "";
          });
        });
      });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Re-filter the source when the active craft changes.
  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource?.("hosts");
    if (src) src.setData(collection(active));
  }, [active]);

  if (!TOKEN) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-stone-soft bg-paper/50 p-8 text-center text-sm text-bark-soft">
        Set{" "}
        <code className="mx-1 rounded bg-cream px-1">
          NEXT_PUBLIC_MAPBOX_TOKEN
        </code>{" "}
        to enable the map.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap gap-1.5 p-3">
        <FilterChip
          label="All crafts"
          active={active === null}
          onClick={() => setActive(null)}
        />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            label={c.name}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pointer-events-auto rounded-full border px-3 py-1 text-xs font-semibold shadow-soft backdrop-blur transition-colors",
        active
          ? "border-moss bg-moss text-paper"
          : "border-stone-soft bg-cream/90 text-bark-soft hover:border-fern hover:text-moss",
      )}
    >
      {label}
    </button>
  );
}
