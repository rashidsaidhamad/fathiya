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
    <div>
      {/* Video Section */}
      <section
        style={{
          position: "relative",
          height: "460px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            filter: "brightness(0.5)",
          }}
        />
        <div style={{ position: "relative", zIndex: 5, textAlign: "center", color: "#fff" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "16px",
              color: "#ddd",
            }}
          >
            THE BEST REAL ESTATE COMPANY
          </p>
          <h2
            style={{
              fontSize: "42px",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              marginBottom: "32px",
              lineHeight: 1.2,
            }}
          >
            Watch this video
            <br />
            to know us better
          </h2>
          <button
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "2px solid #c49a6c",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,154,108,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#c49a6c">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        style={{
          backgroundColor: "#1a1e2e",
          padding: "48px 80px",
          display: "flex",
          justifyContent: "center",
          gap: "80px",
        }}
      >
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: "center", maxWidth: "220px" }}>
            <p
              style={{
                fontSize: "48px",
                color: "#c49a6c",
                fontWeight: 700,
                fontFamily: "Georgia, serif",
                marginBottom: "12px",
              }}
            >
              <AnimatedNumber numeric={stat.numeric} suffix={stat.suffix} decimal={stat.decimal} />
            </p>
            <p style={{ color: "#ffffff", fontSize: "14px", lineHeight: 1.7 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
