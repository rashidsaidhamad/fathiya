"use client";
import { useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";

const articles = [
  {
    slug: "buying-land-zanzibar",
    title: "Complete Guide to Buying Land in Zanzibar: L...",
    date: "December 14, 2025",
    excerpt:
      "Buying land in Zanzibar is a great opportunity for both local buyers and foreign investors. Zanzibar offers strong ...",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  },
  {
    slug: "zipa-approval-foreign-property",
    title: "How ZIPA Approval Works for Foreign Property...",
    date: "December 14, 2025",
    excerpt:
      "Zanzibar is one of the most attractive destinations for foreign property investors. Its growing tourism industry, s ...",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    slug: "best-travel-experiences",
    title: "Best Travel Experiences and Property Opportu...",
    date: "March 4, 2016",
    excerpt:
      "Zanzibar is a beautiful island destination that offers more than just holidays. It is a place where you can enjoy a ...",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
  },
  {
    slug: "investing-in-zanzibar",
    title: "Why Now Is the Best Time to Invest in Zanzibar",
    date: "January 20, 2025",
    excerpt:
      "With new infrastructure projects and a booming tourism sector, Zanzibar presents a once-in-a-generation investment ...",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  },
  {
    slug: "zanzibar-property-laws",
    title: "Understanding Zanzibar Property Laws for Foreigners",
    date: "February 10, 2025",
    excerpt:
      "Foreign investors must navigate specific legal frameworks when purchasing property in Zanzibar. Here is what you need ...",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
];

const VISIBLE = 3;

export default function BlogSection() {
  const { ref, inView } = useInView();
  const [current, setCurrent] = useState(0);

  const maxIndex = articles.length - VISIBLE;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <section ref={ref} style={{ padding: "100px 80px", backgroundColor: "var(--background)", overflow: "hidden" }}>
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
          Our Blog
        </div>
        <h2
          style={{
            fontSize: "40px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "14px",
            letterSpacing: "-0.01em",
          }}
        >
          Read From Our Articles
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.75 }}>
          <a href="#" style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>
            Learn everything you need to know about property laws, ownership, and investment in Zanzibar
          </a>
        </p>
      </div>

      {/* Carousel wrapper */}
      <div style={{ position: "relative" }}>
        {/* Prev arrow */}
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            position: "absolute",
            left: "-22px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            backgroundColor: current === 0 ? "var(--surface)" : "#fff",
            color: current === 0 ? "#ccc" : "var(--accent-dark)",
            fontSize: "22px",
            cursor: current === 0 ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.25s, box-shadow 0.25s",
            boxShadow: "var(--shadow-md)",
          }}
          aria-label="Previous articles"
        >
          &#8249;
        </button>

        {/* Track */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              gap: "28px",
              transform: `translateX(calc(-${current} * (100% / ${VISIBLE} + ${28 / VISIBLE}px)))`,
              transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {articles.map((a, i) => (
              <div
                key={i}
                className="hover-lift"
                style={{
                  flex: `0 0 calc((100% - ${(VISIBLE - 1) * 28}px) / ${VISIBLE})`,
                  backgroundColor: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s, box-shadow 0.35s`,
                  cursor: "pointer",
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
                <div style={{ padding: "22px" }}>
                  <p style={{ fontSize: "12px", color: "var(--accent-dark)", marginBottom: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>{a.date}</p>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", marginBottom: "10px", lineHeight: 1.4 }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: "16px" }}>
                    {a.excerpt}
                  </p>
                  <a
                    href={`/blog/${a.slug}`}
                    style={{
                      fontSize: "13.5px",
                      color: "var(--ink)",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Continue reading <span style={{ fontSize: "16px" }}>&#8250;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          disabled={current === maxIndex}
          style={{
            position: "absolute",
            right: "-22px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            backgroundColor: current === maxIndex ? "var(--surface)" : "#fff",
            color: current === maxIndex ? "#ccc" : "var(--accent-dark)",
            fontSize: "22px",
            cursor: current === maxIndex ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.25s, box-shadow 0.25s",
            boxShadow: "var(--shadow-md)",
          }}
          aria-label="Next articles"
        >
          &#8250;
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: current === i ? 28 : 8,
              height: 8,
              borderRadius: "var(--radius-pill)",
              backgroundColor: current === i ? "var(--accent)" : "#e2ddd4",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s, background-color 0.3s",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* View More Button */}
      <div style={{ display: "flex", justifyContent: "center", margin: "36px 0 0" }}>
        <a
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
        </a>
      </div>
    </section>
  );
}
