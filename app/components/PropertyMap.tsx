"use client";
import { useEffect, useRef } from "react";

const markers = [
  { lat: -6.1659, lng: 39.2026, price: "$770K", title: "Sample Property in Zanzibar 1" },
  { lat: -6.8, lng: 39.28, price: "$770K", title: "Sample Property in Zanzibar 2" },
  { lat: 0.3, lng: 18.5, price: "$6000", title: "Sample Property 3" },
];

export default function PropertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      // Destroy any existing instance on this container
      const container = mapRef.current as any;
      if (container._leaflet_id) {
        try { (L as any).map(container).remove(); } catch (_) {}
        container._leaflet_id = null;
      }

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [-4, 32],
        zoom: 4,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.control.zoom({ position: "topleft" }).addTo(map);

      markers.forEach((m) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:#fff;border:1px solid #ccc;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15)">${m.price}</div>`,
          iconAnchor: [30, 15],
        });
        L.marker([m.lat, m.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${m.title}</b><br>${m.price}`);
      });

      mapInstanceRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      {/* Map toolbar */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 1000,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {["My Location", "Fullscreen", "< Prev", "Next >"].map((btn) => (
          <button
            key={btn}
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "6px 12px",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 500,
            }}
          >
            {btn === "My Location" && "📍 "}
            {btn === "Fullscreen" && "⊕ "}
            {btn}
          </button>
        ))}
      </div>
      {/* Map container */}
      <div ref={mapRef} style={{ width: "100%", height: "420px" }} />
      {/* Open map link */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          right: "8px",
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "4px 10px",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        ∨ open map
      </div>
    </div>
  );
}
