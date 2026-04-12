"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaWhatsapp, FaThLarge, FaList } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PropertyMap = dynamic(() => import("../components/PropertyMap"), { ssr: false });

const properties = [
  {
    id: 1,
    title: "Sample Property in Zanzibar 1",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 5, baths: 6, size: 190, year: 1982,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=600&q=80",
  },
  {
    id: 2,
    title: "Sample Property in Zanzibar 2",
    price: "$ 770,000",
    status: "For Rent",
    active: "Active",
    beds: 5, baths: 6, size: 190, year: 1982,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  },
  {
    id: 3,
    title: "Sample Property in Zanzibar 3",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 5, baths: 5, size: 190, year: 1982,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    id: 4,
    title: "Sample Property in Zanzibar 4",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 4, baths: 3, size: 220, year: 2010,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    id: 5,
    title: "Sample Property in Zanzibar 5",
    price: "$ 770,000",
    status: "For Rent",
    active: "Active",
    beds: 3, baths: 2, size: 150, year: 2015,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  },
  {
    id: 6,
    title: "Sample Property in Zanzibar 6",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 6, baths: 4, size: 300, year: 2005,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
];

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <Navbar forceWhite />
      <div style={{ paddingTop: "70px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Map */}
      <PropertyMap />

      {/* Page content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
          <a href="/" style={{ color: "#333", textDecoration: "none" }}>Home</a>
          <span style={{ margin: "0 6px", color: "#aaa" }}>›</span>
          <span style={{ color: "#c49a6c", fontWeight: 600 }}>Properties</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#1a1a2e", marginBottom: "24px", fontFamily: "Georgia, serif" }}>
          Properties
        </h1>

        {/* Filter bar */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          {["Types", "Categories", "States", "Cities", "Areas", "Price High to Low"].map((f) => (
            <select
              key={f}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "6px 10px",
                fontSize: "13px",
                color: "#444",
                cursor: "pointer",
                background: "#fff",
              }}
            >
              <option>{f}</option>
            </select>
          ))}
          {/* View toggle */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: viewMode === "grid" ? "#c49a6c" : "#fff",
                color: viewMode === "grid" ? "#fff" : "#555",
              }}
            >
              <FaThLarge size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: viewMode === "list" ? "#c49a6c" : "#fff",
                color: viewMode === "list" ? "#fff" : "#555",
              }}
            >
              <FaList size={14} />
            </button>
          </div>
        </div>

        {/* Properties grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: viewMode === "grid" ? "repeat(3, 1fr)" : "1fr",
            gap: "24px",
          }}
        >
          {properties.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: "200px" }}>
                <div
                  style={{
                    width: "100%", height: "100%",
                    backgroundImage: `url('${p.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {/* Status tags */}
                <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "5px" }}>
                  <span style={{ background: "#c49a6c", color: "#fff", padding: "3px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 600 }}>
                    {p.status}
                  </span>
                  <span style={{ background: "#c49a6c", color: "#fff", padding: "3px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 600 }}>
                    {p.active}
                  </span>
                </div>
                {/* Bottom action icons */}
                <div style={{ position: "absolute", bottom: "10px", left: "10px", display: "flex", gap: "6px" }}>
                  {[
                    <svg key="s" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
                    <svg key="h" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
                    <span key="p" style={{ fontSize: "14px", color: "#555" }}>+</span>,
                  ].map((icon, i) => (
                    <button key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {icon}
                    </button>
                  ))}
                </div>
                {/* Prev/Next arrows */}
                <button style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", fontSize: "14px" }}>‹</button>
                <button style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", fontSize: "14px" }}>›</button>
              </div>

              {/* Info */}
              <div style={{ padding: "16px" }}>
                <p style={{ color: "#c49a6c", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{p.price}</p>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#222", marginBottom: "8px" }}>{p.title}</h3>
                <p style={{ color: "#777", fontSize: "12px", marginBottom: "12px", lineHeight: 1.6 }}>{p.description}</p>
                <div style={{ display: "flex", gap: "14px", fontSize: "12px", fontWeight: 600, color: "#333", marginBottom: "14px" }}>
                  <span>Beds: {p.beds}</span>
                  <span>Baths: {p.baths}</span>
                  <span>Size: {p.size} ft²</span>
                  <span>Year Built: {p.year}</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ flex: 1, padding: "8px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "#555" }}>
                    <FaPhone size={11} color="#c49a6c" /> Call
                  </button>
                  <button style={{ flex: 1, padding: "8px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "#555" }}>
                    <FaEnvelope size={11} color="#c49a6c" /> Email
                  </button>
                  <button style={{ padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FaWhatsapp size={14} color="#25D366" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}
