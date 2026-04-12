"use client";
import { useEffect, useRef } from "react";

export default function ContactMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const container = mapRef.current as any;
      if (container._leaflet_id) {
        try { (L as any).map(container).remove(); } catch (_) {}
        container._leaflet_id = null;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [-6.165, 39.19],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.control.zoom({ position: "topleft" }).addTo(map);

      // Main office marker (house icon)
      const houseIcon = L.divIcon({
        className: "",
        html: `<div style="background:#c0392b;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:14px">🏠</span></div>`,
        iconAnchor: [18, 36],
      });

      L.marker([-6.165, 39.19], { icon: houseIcon })
        .addTo(map)
        .bindPopup("<b>Archipelago Real Estate</b><br>Mlandege, Zanzibar Urban/West");

      // Nearby property markers
      const nearbyLocations = [
        [-6.155, 39.185], [-6.17, 39.18], [-6.16, 39.2],
        [-6.175, 39.195], [-6.15, 39.19], [-6.168, 39.175],
        [-6.18, 39.185], [-6.162, 39.205],
      ];

      const plusIcon = L.divIcon({
        className: "",
        html: `<div style="background:#c0392b;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:bold;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)">+</div>`,
        iconAnchor: [11, 11],
      });

      nearbyLocations.forEach((loc) => {
        L.marker(loc as [number, number], { icon: plusIcon }).addTo(map);
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
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Info overlay */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "70px",
          zIndex: 1000,
          background: "#fff",
          borderRadius: "6px",
          padding: "24px 28px",
          width: "380px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "17px", marginBottom: "14px", color: "#1a1a2e" }}>
          How To Find Us
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#444", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>📞</span> +255 659 740 712
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>✉️</span> archipelagoproperties.zanzibar@gmail.com
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{ marginTop: "2px" }}>🏠</span>
            <span>Mlandege, Zanzibar Urban/West – Tanzania</span>
          </div>
        </div>
        <h4 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "10px", color: "#1a1a2e" }}>
          Opening Hours
        </h4>
        <div style={{ fontSize: "13px", color: "#555", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>Monday - Saturday</span>
            <span>08:30 - 15:30</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>Sunday</span>
            <span>Closed</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1000, display: "flex", gap: "8px" }}>
        {["📍 My Location", "⊕ Fullscreen"].map((btn) => (
          <button key={btn} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "4px", padding: "7px 14px", fontSize: "13px", cursor: "pointer", fontWeight: 500 }}>
            {btn}
          </button>
        ))}
      </div>

      {/* open map */}
      <div style={{ position: "absolute", bottom: "8px", right: "8px", zIndex: 1000, background: "#fff", border: "1px solid #ddd", borderRadius: "4px", padding: "4px 10px", fontSize: "12px", cursor: "pointer" }}>
        ∨ open map
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "480px" }} />
    </div>
  );
}
