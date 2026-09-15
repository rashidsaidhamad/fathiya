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
    <section ref={ref} className="testimonials-root" style={{ padding: "100px clamp(18px, 6vw, 80px)", backgroundColor: "var(--surface)" }}>
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
          {content.homePage.testimonialsBadge}
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
          {content.homePage.testimonialsTitle}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          {content.homePage.testimonialsDescription}
        </p>
        <div style={{ marginTop: "22px" }}>
          <Link
            href="/company#testimonials"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "11px 22px",
              borderRadius: "var(--radius-pill)",
              border: "1.5px solid var(--border)",
              color: "var(--ink)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              transition: "border-color 0.25s, color 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLElement).style.color = "var(--accent-dark)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--ink)";
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
            className="hover-lift"
            style={{
              backgroundColor: "var(--background)",
              borderRadius: "var(--radius-md)",
              padding: "32px",
              position: "relative",
              boxShadow: "var(--shadow-sm)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              display: "flex",
              flexDirection: "column",
              minHeight: "340px",
              flex: "1 1 300px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "22px",
                right: "26px",
                fontFamily: "var(--font-display)",
                fontSize: "52px",
                color: "var(--accent-soft)",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              &rdquo;
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 700,
                  flexShrink: 0,
                  border: "2px solid var(--surface)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {t.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)" }}>{t.name}</p>
                <p style={{ fontSize: "12px", color: "var(--muted)" }}>{t.role}</p>
              </div>
            </div>
            <ExpandableDescription
              description={t.text}
              maxLength={200}
              color="var(--ink-soft)"
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
