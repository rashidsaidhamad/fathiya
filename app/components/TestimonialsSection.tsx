"use client";
import Link from "next/link";
import { useInView } from "../hooks/useInView";
import { useSiteContent } from "../hooks/useSiteContent";
import ExpandableDescription from "./ExpandableDescription";

export default function TestimonialsSection() {
  const { ref, inView } = useInView();
  const content = useSiteContent();
  const testimonials = content.companyTestimonials;

  return (
    <section ref={ref} className="testimonials-root" style={{ padding: "80px clamp(18px, 6vw, 80px)", backgroundColor: "#fff" }}>
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
          {content.homePage.testimonialsBadge}
        </p>
        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Georgia, serif",
            color: "#222",
            marginBottom: "12px",
          }}
        >
          {content.homePage.testimonialsTitle}
        </h2>
        <p style={{ color: "#888", fontSize: "14px" }}>
          {content.homePage.testimonialsDescription}
        </p>
        <div style={{ marginTop: "18px" }}>
          <Link
            href="/company#testimonials"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "999px",
              border: "1px solid #c49a6c",
              color: "#c49a6c",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.4px",
            }}
          >
            See More
          </Link>
        </div>
      </div>

      <div
        className="testimonials-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "28px",
          alignItems: "flex-start",
        }}
      >
        {testimonials.slice(0, 3).map((t, i) => (
          <div
            key={t.id}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "28px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              display: "flex",
              flexDirection: "column",
              minHeight: "340px",
              flex: "1 1 300px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#e8ddd4",
                  color: "#6b4f33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {t.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "15px", color: "#222" }}>{t.name}</p>
                <p style={{ fontSize: "12px", color: "#888" }}>{t.role}</p>
              </div>
            </div>
            <ExpandableDescription
              description={t.text}
              maxLength={200}
              color="#555"
              fontSize="14px"
              marginBottom="16px"
              lineHeight={1.7}
            />
            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: t.stars }).map((_, j) => (
                <span key={j} style={{ color: "#f5a623", fontSize: "18px" }}>
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
