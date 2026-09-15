"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: "3,420",
    numeric: 3420,
    suffix: "",
    label: "Inventory who are commited to their management tasks",
  },
  {
    value: "2.73%",
    numeric: 2.73,
    suffix: "%",
    decimal: true,
    label: "Average mortgage rate paid by buyers who use our services",
  },
  {
    value: "5,378",
    numeric: 5378,
    suffix: "",
    label: "Sales closed are commited to their management tasks",
  },
];

function AnimatedNumber({ numeric, suffix, decimal }: { numeric: number; suffix: string; decimal?: boolean }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = numeric / steps;
          let current = 0;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            current = Math.min(current + increment, numeric);
            setDisplay(current);
            if (step >= steps) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numeric]);

  const formatted = decimal
    ? display.toFixed(2)
    : Math.round(display).toLocaleString();

  return <span ref={ref}>{formatted}{suffix}</span>;
}

export default function VideoStatsSection() {
  return (
    <div style={{ backgroundColor: "var(--background)", padding: "0 80px 100px" }}>
      {/* Video Section */}
      <section
        style={{
          position: "relative",
          height: "480px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(12,13,20,0.55) 0%, rgba(12,13,20,0.7) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 5, textAlign: "center", color: "#fff", padding: "0 20px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "18px",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
            }}
          >
            The Best Real Estate Company
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 46px)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              marginBottom: "36px",
              lineHeight: 1.2,
            }}
          >
            Watch this video
            <br />
            to know us better
          </h2>
          <button
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              transition: "transform 0.3s ease, background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,154,108,0.85)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="hover-lift"
            style={{
              textAlign: "center",
              padding: "32px 24px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--navy)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <p
              style={{
                fontSize: "42px",
                color: "var(--accent-light)",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                marginBottom: "10px",
              }}
            >
              <AnimatedNumber numeric={stat.numeric} suffix={stat.suffix} decimal={stat.decimal} />
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13.5px", lineHeight: 1.7 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
