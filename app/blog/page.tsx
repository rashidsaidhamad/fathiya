"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { defaultSiteContent, type ArticleItem } from "../../lib/siteContent";

export default function BlogPage() {
  const [allArticles, setAllArticles] = useState<ArticleItem[]>(defaultSiteContent.articles);
  const [expandedSummaries, setExpandedSummaries] = useState<Record<string, boolean>>({});

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

  function toggleSummary(slug: string) {
    setExpandedSummaries((current) => ({
      ...current,
      [slug]: !current[slug],
    }));
  }

  function getSummaryText(excerpt: string, slug: string) {
    const isExpanded = expandedSummaries[slug] ?? false;
    if (isExpanded) return excerpt;

    const words = excerpt.trim().split(/\s+/);
    if (words.length <= 28) return excerpt;

    return `${words.slice(0, 28).join(" ")}...`;
  }

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
        <div className="blog-page-wrap" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
          <div className="blog-landscape-list" style={{ display: "grid", gap: "24px" }}>
            {allArticles.map((a, i) => (
              <article
                key={i}
                className="blog-landscape-card"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: "220px",
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
                <a href={`/blog/${a.slug}`} className="blog-landscape-image-link" style={{ textDecoration: "none", flex: "0 0 38%", minWidth: "280px" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "220px",
                      backgroundImage: `url('${a.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </a>

                <div className="blog-landscape-content" style={{ padding: "22px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <a href={`/blog/${a.slug}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#222", marginBottom: "6px", lineHeight: 1.35 }}>
                      {a.title}
                    </h3>
                  </a>
                  <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px" }}>{a.date}</p>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, marginBottom: "10px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {getSummaryText(a.excerpt, a.slug)}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleSummary(a.slug)}
                    style={{
                      alignSelf: "flex-start",
                      border: "none",
                      background: "transparent",
                      color: "#c49a6c",
                      padding: 0,
                      marginBottom: "14px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {expandedSummaries[a.slug] ? "Show less" : "Show more"}
                  </button>
                  <a
                    href={`/blog/${a.slug}`}
                    style={{ fontSize: "13px", color: "#333", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", marginTop: "auto" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c49a6c")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#333")}
                  >
                    Continue reading <span style={{ fontSize: "16px" }}>›</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .blog-page-wrap { padding: 24px 16px !important; }
          .blog-landscape-card { flex-direction: column; min-height: auto !important; }
          .blog-landscape-image-link { flex: 1 1 auto !important; min-width: 0 !important; }
          .blog-landscape-image-link > div { min-height: 220px !important; height: 220px !important; }
          .blog-landscape-content { padding: 18px !important; }
        }

        @media (max-width: 600px) {
          .blog-landscape-image-link > div { min-height: 190px !important; height: 190px !important; }
          .blog-landscape-content h3 { font-size: 16px !important; }
        }
      `}</style>
      <Footer />
    </>
  );
}
