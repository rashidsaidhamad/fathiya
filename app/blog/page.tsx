"use client";
import { useState, useEffect } from "react";
import { FaThLarge, FaList } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { defaultSiteContent, type ArticleItem } from "../../lib/siteContent";

export default function BlogPage() {
  const [allArticles, setAllArticles] = useState<ArticleItem[]>(defaultSiteContent.articles);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch("/api/site-content")
      .then((res) => res.json())
      .then((data) => {
        setAllArticles(data.articles);
      })
      .catch(() => {
        // Keep defaults.
      });
  }, []);

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
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "18px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
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
                aria-label="Grid view"
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
                aria-label="List view"
              >
                <FaList size={14} />
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: viewMode === "grid" ? "1fr 1fr" : "1fr",
              gap: "24px",
            }}
          >
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
        </div>
      </div>
      <Footer />
    </>
  );
}
