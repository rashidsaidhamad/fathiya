"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const allArticles = [
  {
    slug: "buying-land-zanzibar",
    title: "Complete Guide to Buying Land in Zanzibar: L...",
    date: "December 14, 2025",
    excerpt: "Buying land in Zanzibar is a great opportunity for both local buyers and foreign investors. Zanzibar offers strong ...",
    image: "https://images.unsplash.com/photo-1582610116397-edb72c0ff479?w=600&q=80",
  },
  {
    slug: "zipa-approval-foreign-property",
    title: "How ZIPA Approval Works for Foreign Property...",
    date: "December 14, 2025",
    excerpt: "Zanzibar is one of the most attractive destinations for foreign property investors. Its growing tourism industry, s ...",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  },
  {
    slug: "best-travel-experiences",
    title: "Best Travel Experiences and Property Opportu...",
    date: "March 4, 2016",
    excerpt: "Zanzibar is a beautiful island destination that offers more than just holidays. It is a place where you can enjoy a ...",
    image: "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=600&q=80",
  },
  {
    slug: "investment-opportunities-zanzibar",
    title: "Top Investment Opportunities in Zanzibar 2025",
    date: "January 10, 2026",
    excerpt: "Zanzibar's real estate market is booming. With new regulations and increasing tourism, 2025 is the ideal time to invest ...",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    slug: "property-laws-foreigners",
    title: "Understanding Property Laws for Foreigners in Tanzania",
    date: "February 5, 2026",
    excerpt: "Foreign nationals looking to buy property in Tanzania must navigate specific legal frameworks. Here is what you need to know ...",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
];

const latestListings = [
  { title: "Sample Property in Zanzibar 3", price: "$ 770,000", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80" },
  { title: "Sample Property in Zanzibar 2", price: "$ 770,000", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&q=80" },
  { title: "Sample Property in Zanzibar 1", price: "$ 770,000", image: "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=200&q=80" },
];

export default function BlogPage() {
  const [priceRange, setPriceRange] = useState(10000000);

  return (
    <>
      <Navbar forceWhite />

      {/* Page Header Banner */}
      <div
        style={{
          position: "relative",
          height: "260px",
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "70px",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20,20,40,0.55)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff" }}>
          <h1 style={{ fontSize: "42px", fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: "12px" }}>
            Blog List
          </h1>
          <div style={{ fontSize: "14px", opacity: 0.85 }}>
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#c49a6c", fontWeight: 600 }}>Blog List</span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#f5f5f5", minHeight: "60vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>
            {/* Left: Blog cards 2-column grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {allArticles.map((a, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
                  }}
                >
                  <a href={`/blog/${a.slug}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        height: "200px",
                        backgroundImage: `url('${a.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </a>
                  <div style={{ padding: "20px" }}>
                    <a href={`/blog/${a.slug}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#222", marginBottom: "6px", lineHeight: 1.4 }}>
                        {a.title}
                      </h3>
                    </a>
                    <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>{a.date}</p>
                    <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "14px" }}>
                      {a.excerpt}
                    </p>
                    <a
                      href={`/blog/${a.slug}`}
                      style={{ fontSize: "13px", color: "#333", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c49a6c")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#333")}
                    >
                      Continue reading <span style={{ fontSize: "16px" }}>›</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Right sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Advanced Search */}
              <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>Advanced Search</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {["Types", "Location", "All Types", "Sell or Rent", "Bedrooms", "Listing Status"].map((f, i) => (
                    i === 1 ? (
                      <input key={f} placeholder="Location" style={{ padding: "9px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px", outline: "none" }} />
                    ) : (
                      <select key={f} style={{ padding: "9px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px", color: "#555", background: "#fff", cursor: "pointer" }}>
                        <option>{f}</option>
                      </select>
                    )
                  ))}
                  <div>
                    <p style={{ fontSize: "12px", color: "#c49a6c", marginBottom: "6px" }}>
                      Price range: $ 0 to $ {priceRange.toLocaleString()}
                    </p>
                    <input type="range" min={0} max={10000000} step={100000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} style={{ width: "100%", accentColor: "#c49a6c" }} />
                  </div>
                  <a href="#" style={{ color: "#c49a6c", fontSize: "13px", textDecoration: "none" }}>More Search Options</a>
                  <button style={{ backgroundColor: "#c49a6c", color: "#fff", border: "none", borderRadius: "4px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                    Search
                  </button>
                </div>
              </div>

              {/* Latest Listings */}
              <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>Latest Listings</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {latestListings.map((l, i) => (
                    <a key={i} href="/properties" style={{ display: "flex", gap: "12px", alignItems: "center", textDecoration: "none" }}>
                      <img src={l.image} alt={l.title} style={{ width: 70, height: 55, objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#222", marginBottom: "4px" }}>{l.title}</p>
                        <p style={{ fontSize: "13px", color: "#c49a6c", fontWeight: 700 }}>{l.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
