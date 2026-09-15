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
          height: "300px",
          paddingTop: "110px",
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(12,13,20,0.68) 0%, rgba(12,13,20,0.58) 100%)",
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
            <span style={{ color: "var(--accent-light)" }}>Blog List</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 46px)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "10px" }}>
            Insights &amp; Stories
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto" }}>
            Property laws, ownership guides, and investment opportunities across Zanzibar.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", minHeight: "60vh" }}>
        <div className="blog-page-wrap" style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(32px, 5vw, 56px) clamp(16px, 3vw, 24px)" }}>
          <div className="blog-landscape-list" style={{ display: "grid", gap: "26px" }}>
            {allArticles.map((a, i) => (
              <article
                key={i}
                className="blog-landscape-card hover-lift"
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: "220px",
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

                <div className="blog-landscape-content" style={{ padding: "26px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ fontSize: "12px", color: "var(--accent-dark)", marginBottom: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>{a.date}</p>
                  <a href={`/blog/${a.slug}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "19px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", marginBottom: "10px", lineHeight: 1.35 }}>
                      {a.title}
                    </h3>
                  </a>
                  <p style={{ fontSize: "14px", color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: "10px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {getSummaryText(a.excerpt, a.slug)}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleSummary(a.slug)}
                    style={{
                      alignSelf: "flex-start",
                      border: "none",
                      background: "transparent",
                      color: "var(--accent-dark)",
                      padding: 0,
                      marginBottom: "16px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {expandedSummaries[a.slug] ? "Show less" : "Show more"}
                  </button>
                  <a
                    href={`/blog/${a.slug}`}
                    style={{ fontSize: "13.5px", color: "var(--ink)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", marginTop: "auto" }}
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
          .blog-landscape-content { padding: 20px !important; }
        }

        @media (max-width: 600px) {
          .blog-landscape-image-link > div { min-height: 190px !important; height: 190px !important; }
          .blog-landscape-content h3 { font-size: 17px !important; }
        }
      `}</style>
      <Footer />
    </>
  );
}
