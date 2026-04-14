"use client";
import { useInView } from "../hooks/useInView";
import { useSiteContent } from "../hooks/useSiteContent";

export default function TestimonialsSection() {
  const { ref, inView } = useInView();
  const content = useSiteContent();
  const testimonials = content.companyTestimonials;

  return (
    <section ref={ref} style={{ padding: "80px 80px", backgroundColor: "#fff" }}>
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
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "28px",
        }}
      >
        {testimonials.map((t, i) => (
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
            <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>
              {t.text}
            </p>
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
