"use client";
import { useInView } from "../hooks/useInView";

const testimonials = [
  {
    name: "Shamis Aziz",
    role: "Happy Seller",
    text: "Great service and very helpful team. They guided me through the whole process and made buying property in Zanzibar easy and stress-free",
    stars: 5,
  },
  {
    name: "Shamis Aziz",
    role: "Happy Seller",
    text: "Great service and very helpful team. They guided me through the whole process and made buying property in Zanzibar easy and stress-free",
    stars: 5,
  },
  {
    name: "Shamis Aziz",
    role: "Happy Buyer",
    text: "Great service and very helpful team. They guided me through the whole process and made buying property in Zanzibar easy and stress-free",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} style={{ padding: "100px 80px", backgroundColor: "var(--surface)" }}>
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
          Testimonials
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
          What Clients Say
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          <a href="#" style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>
            Real feedback from clients who successfully invested with our support
          </a>
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
            key={i}
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
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "24px",
                right: "28px",
                fontFamily: "var(--font-display)",
                fontSize: "56px",
                color: "var(--accent-soft)",
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              &rdquo;
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "#e8ddd4",
                  backgroundImage:
                    "url('https://ui-avatars.com/api/?name=Shamis+Aziz&background=c49a6c&color=fff&size=50')",
                  backgroundSize: "cover",
                  flexShrink: 0,
                  border: "2px solid var(--surface)",
                  boxShadow: "var(--shadow-sm)",
                }}
              />
              <div>
                <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)" }}>{t.name}</p>
                <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>{t.role}</p>
              </div>
            </div>
            <p style={{ color: "var(--ink-soft)", fontSize: "14.5px", lineHeight: 1.75, marginBottom: "18px" }}>
              {t.text}
            </p>
            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: t.stars }).map((_, j) => (
                <span key={j} style={{ color: "#f5a623", fontSize: "16px" }}>
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
