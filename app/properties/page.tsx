"use client";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaWhatsapp, FaThLarge, FaList, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const properties = [
  {
    id: 1,
    title: "Sample Property in Zanzibar 1",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 5, baths: 6, size: 190, year: 1982,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80",
  },
  {
    id: 2,
    title: "Sample Property in Zanzibar 2",
    price: "$ 770,000",
    status: "For Rent",
    active: "Active",
    beds: 5, baths: 6, size: 190, year: 1982,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&q=80",
  },
  {
    id: 3,
    title: "Sample Property in Zanzibar 3",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 5, baths: 5, size: 190, year: 1982,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
  },
  {
    id: 4,
    title: "Sample Property in Zanzibar 4",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 4, baths: 3, size: 220, year: 2010,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80",
  },
  {
    id: 5,
    title: "Sample Property in Zanzibar 5",
    price: "$ 770,000",
    status: "For Rent",
    active: "Active",
    beds: 3, baths: 2, size: 150, year: 2015,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80",
  },
  {
    id: 6,
    title: "Sample Property in Zanzibar 6",
    price: "$ 770,000",
    status: "For Sale",
    active: "Active",
    beds: 6, baths: 4, size: 300, year: 2005,
    description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80",
  },
];

const filters = ["Types", "Categories", "States", "Cities", "Areas", "Price High to Low"];

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <Navbar forceWhite />

      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: "320px",
          paddingTop: "110px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(12,13,20,0.65) 0%, rgba(12,13,20,0.55) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "0 20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <span style={{ color: "var(--accent-light)" }}>Properties</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "10px" }}>
            Explore Our Properties
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto" }}>
            Handpicked homes, villas, and land across Zanzibar — ready for you to discover.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh", paddingBottom: "40px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px 40px 0" }}>
          {/* Filter bar */}
          <div
            className="glass"
            style={{
              borderRadius: "var(--radius-md)",
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "36px",
              flexWrap: "wrap",
              boxShadow: "var(--shadow-sm)",
              backgroundColor: "var(--surface)",
            }}
          >
            {filters.map((f) => (
              <select
                key={f}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-pill)",
                  padding: "9px 16px",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "var(--ink-soft)",
                  cursor: "pointer",
                  backgroundColor: "var(--background)",
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
                  width: 38,
                  height: 38,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  backgroundColor: viewMode === "grid" ? "var(--accent)" : "var(--background)",
                  color: viewMode === "grid" ? "#fff" : "var(--ink-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.25s, color 0.25s",
                }}
              >
                <FaThLarge size={13} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  width: 38,
                  height: 38,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  backgroundColor: viewMode === "list" ? "var(--accent)" : "var(--background)",
                  color: viewMode === "list" ? "#fff" : "var(--ink-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.25s, color 0.25s",
                }}
              >
                <FaList size={13} />
              </button>
            </div>
          </div>

          {/* Results count */}
          <p style={{ fontSize: "13.5px", color: "var(--muted)", marginBottom: "20px", fontWeight: 500 }}>
            Showing {properties.length} properties
          </p>

          {/* Properties grid/list */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: viewMode === "grid" ? "repeat(3, 1fr)" : "1fr",
              gap: "28px",
              marginBottom: "20px",
            }}
          >
            {properties.map((p) =>
              viewMode === "grid" ? (
                <div
                  key={p.id}
                  className="hover-lift"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ position: "relative", height: "210px" }}>
                    <div
                      style={{
                        width: "100%", height: "100%",
                        backgroundImage: `url('${p.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div style={{ position: "absolute", top: "14px", right: "14px", display: "flex", gap: "6px" }}>
                      <span style={{ background: "var(--accent)", color: "#fff", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                        {p.status}
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.9)", color: "#2f9e5b", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                        {p.active}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <p style={{ color: "var(--accent-dark)", fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>{p.price}</p>
                    <h3 style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>{p.title}</h3>
                    <p style={{ color: "var(--ink-soft)", fontSize: "13px", marginBottom: "16px", lineHeight: 1.6 }}>{p.description}</p>
                    <div style={{ display: "flex", gap: "14px", fontSize: "12.5px", color: "var(--ink-soft)", fontWeight: 600, marginBottom: "18px", flexWrap: "wrap", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                      <span>Beds: {p.beds}</span>
                      <span>Baths: {p.baths}</span>
                      <span>Size: {p.size} ft²</span>
                      <span>Year: {p.year}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={{ flex: 1, padding: "9px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "var(--ink-soft)", fontWeight: 600 }}>
                        <FaPhone size={11} color="var(--accent-dark)" /> Call
                      </button>
                      <button style={{ flex: 1, padding: "9px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "var(--ink-soft)", fontWeight: 600 }}>
                        <FaEnvelope size={11} color="var(--accent-dark)" /> Email
                      </button>
                      <button style={{ padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaWhatsapp size={14} color="#25D366" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={p.id}
                  className="hover-lift"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                  }}
                >
                  <div style={{ position: "relative", width: "300px", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "100%", height: "100%",
                        backgroundImage: `url('${p.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div style={{ position: "absolute", top: "14px", right: "14px", display: "flex", gap: "6px" }}>
                      <span style={{ background: "var(--accent)", color: "#fff", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ color: "var(--accent-dark)", fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>{p.price}</p>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>{p.title}</h3>
                    <p style={{ color: "var(--ink-soft)", fontSize: "13.5px", marginBottom: "16px", lineHeight: 1.65, maxWidth: "560px" }}>{p.description}</p>
                    <div style={{ display: "flex", gap: "22px", fontSize: "13px", color: "var(--ink-soft)", fontWeight: 600, marginBottom: "18px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaBed color="var(--accent-dark)" size={13} /> {p.beds} Beds</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaBath color="var(--accent-dark)" size={13} /> {p.baths} Baths</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaRulerCombined color="var(--accent-dark)" size={13} /> {p.size} ft²</span>
                      <span>Year: {p.year}</span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button style={{ padding: "9px 18px", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12.5px", color: "var(--ink-soft)", fontWeight: 600 }}>
                        <FaPhone size={11} color="var(--accent-dark)" /> Call
                      </button>
                      <button style={{ padding: "9px 18px", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12.5px", color: "var(--ink-soft)", fontWeight: 600 }}>
                        <FaEnvelope size={11} color="var(--accent-dark)" /> Email
                      </button>
                      <button style={{ padding: "9px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaWhatsapp size={14} color="#25D366" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
