"use client";
import Link from "next/link";
import { useInView } from "../hooks/useInView";
import { useSiteContent } from "../hooks/useSiteContent";

export default function BlogSection() {
  const { ref, inView } = useInView();
  const content = useSiteContent();
  const articles = content.articles;

  return (
    <section ref={ref} className="blog-root" style={{ padding: "80px clamp(18px, 6vw, 80px)", backgroundColor: "#faf8f5", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <p
          style={{
            color: "#c49a6c",
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {content.homePage.blogBadge}
        </p>
        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Georgia, serif",
            color: "#222",
            marginBottom: "12px",
          }}
        >
          {content.homePage.blogTitle}
        </h2>
        <p style={{ color: "#888", fontSize: "14px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
          {content.homePage.blogDescription}
        </p>
      </div>

      <div
        className="blog-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
          alignItems: "stretch",
        }}
      >
        {articles.map((a, i) => (
          <article
            key={i}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
                <div
                  style={{
                    height: "180px",
                    backgroundImage: `url('${a.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#222", marginBottom: "6px" }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>{a.date}</p>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "14px" }}>
                    {a.excerpt}
                  </p>
                  <Link
                    href={`/blog/${a.slug}`}
                    style={{
                      fontSize: "13px",
                      color: "#333",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "auto",
                    }}
                  >
                    Continue reading <span style={{ fontSize: "16px" }}>&#8250;</span>
                  </Link>
                </div>
          </article>
        ))}
      </div>

      {/* View More Button */}
      <div style={{ display: "flex", justifyContent: "center", margin: "28px 0 0" }}>
        <Link
          href="/blog"
          style={{
            backgroundColor: "#c49a6c",
            color: "#fff",
            padding: "12px 36px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
            transition: "background-color 0.3s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a07850")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#c49a6c")}
        >
          View More
        </Link>
      </div>
    </section>
  );
}
