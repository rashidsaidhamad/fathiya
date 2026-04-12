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
      "https://images.unsplash.com/photo-1582610116397-edb72c0ff479?w=600&q=80",
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
      "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=600&q=80",
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
    <section ref={ref} style={{ padding: "80px 80px", backgroundColor: "#faf8f5", overflow: "hidden" }}>
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
          OUR BLOG
        </p>
        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Georgia, serif",
            color: "#222",
            marginBottom: "12px",
          }}
        >
          Read From Our Articles
        </h2>
        <p style={{ color: "#888", fontSize: "14px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
          <a href="#" style={{ color: "#c49a6c" }}>
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
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "2px solid #c49a6c",
            backgroundColor: current === 0 ? "#f0e8de" : "#c49a6c",
            color: current === 0 ? "#c49a6c" : "#fff",
            fontSize: "22px",
            cursor: current === 0 ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.25s, color 0.25s",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
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
                style={{
                  flex: `0 0 calc((100% - ${(VISIBLE - 1) * 28}px) / ${VISIBLE})`,
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
                  cursor: "pointer",
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
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#222", marginBottom: "6px" }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>{a.date}</p>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "14px" }}>
                    {a.excerpt}
                  </p>
                  <a
                    href={`/blog/${a.slug}`}
                    style={{
                      fontSize: "13px",
                      color: "#333",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
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
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "2px solid #c49a6c",
            backgroundColor: current === maxIndex ? "#f0e8de" : "#c49a6c",
            color: current === maxIndex ? "#c49a6c" : "#fff",
            fontSize: "22px",
            cursor: current === maxIndex ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.25s, color 0.25s",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          }}
          aria-label="Next articles"
        >
          &#8250;
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "28px" }}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: current === i ? 28 : 10,
              height: 10,
              borderRadius: "5px",
              backgroundColor: current === i ? "#c49a6c" : "#ddd",
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
      <div style={{ display: "flex", justifyContent: "center", margin: "28px 0 0" }}>
        <a
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
        </a>
      </div>
    </section>
  );
}
