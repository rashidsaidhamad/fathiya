"use client";
import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "../hooks/useSiteContent";

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
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const content = useSiteContent();
  const videoSrc = content.videoSection.videoUrl;

  return (
    <>
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
                `url('${content.videoSection.backgroundImage}')`,
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
              {content.videoSection.badge}
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
            {content.videoSection.headingLine1}
            <br />
            {content.videoSection.headingLine2}
          </h2>
          <button
            type="button"
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.45)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              transition: "transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",
              boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
            }}
            onClick={() => setIsVideoOpen(true)}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.backgroundColor = "rgba(196,154,108,0.28)";
              target.style.borderColor = "rgba(196,154,108,0.9)";
              target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.backgroundColor = "rgba(255,255,255,0.08)";
              target.style.borderColor = "rgba(255,255,255,0.45)";
              target.style.transform = "scale(1)";
            }}
            aria-label="Play company video"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
          <p style={{ margin: "14px 0 0", fontSize: "13px", color: "#ddd" }}>
            {content.videoSection.helperText}
          </p>
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

      {isVideoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Company video"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 4000,
            backgroundColor: "rgba(10, 12, 18, 0.78)",
            display: "grid",
            placeItems: "center",
            padding: "24px",
          }}
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            style={{
              position: "relative",
              width: "min(920px, 100%)",
              backgroundColor: "#0d1220",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close video"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "rgba(255,255,255,0.14)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
                zIndex: 1,
              }}
            >
              ×
            </button>
            <video
              src={videoSrc}
              controls
              autoPlay
              playsInline
              poster={content.videoSection.videoPoster}
              style={{ width: "100%", display: "block", aspectRatio: "16 / 9", objectFit: "cover" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
