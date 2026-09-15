"use client";
import Link from "next/link";
import { useInView } from "../hooks/useInView";
import { useSiteContent } from "../hooks/useSiteContent";

export default function BlogSection() {
  const { ref, inView } = useInView();
  const content = useSiteContent();
  const articles = content.articles;

  return (
    <section ref={ref} className="blog-root" style={{ padding: "100px clamp(18px, 6vw, 80px)", backgroundColor: "var(--background)", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 16px",
            borderRadius: "var(--radius-pill)",
            backgroundColor: "var(--accent-soft)",
            color: "var(--accent-dark)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          {content.homePage.blogBadge}
        </div>
        <h2
          style={{
            fontSize: "40px",
            fontFamily: "var(--font-display)",
            color: "var(--ink)",
            fontWeight: 700,
            marginBottom: "14px",
            letterSpacing: "-0.01em",
          }}
        >
          {content.homePage.blogTitle}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.75 }}>
          {content.homePage.blogDescription}
        </p>
      </div>

      <div
        className="blog-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "26px",
          alignItems: "stretch",
        }}
      >
        {articles.slice(0, 3).map((a, i) => (
          <article
            key={i}
            className="hover-lift"
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
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
                    height: "190px",
                    backgroundImage: `url('${a.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: "22px", display: "flex", flexDirection: "column", height: "100%" }}>
                  <p style={{ fontSize: "12px", color: "var(--accent-dark)", marginBottom: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>{a.date}</p>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", marginBottom: "10px", lineHeight: 1.4 }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: "16px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {a.excerpt}
                  </p>
                  <Link
                    href={`/blog/${a.slug}`}
                    style={{
                      fontSize: "13.5px",
                      color: "var(--ink)",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
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
      <div style={{ display: "flex", justifyContent: "center", margin: "36px 0 0" }}>
        <Link
          href="/blog"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
            color: "#fff",
            padding: "14px 38px",
            borderRadius: "var(--radius-pill)",
            textDecoration: "none",
            fontSize: "14.5px",
            fontWeight: 700,
            transition: "transform 0.25s",
            display: "inline-block",
            boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
        >
          View More
        </Link>
      </div>
    </section>
  );
}
