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
  const content = useSiteContent();
  const videoSrc = content.videoSection.videoUrl;

  return (
    <>
      {/* Video Section */}
      <section
        className="video-root"
        style={{
          position: "relative",
          height: "460px",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={content.videoSection.videoPoster || content.videoSection.backgroundImage}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.5)",
            }}
          />
        ) : (
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
        )}
        <div
          className="video-overlay-card"
          style={{
            position: "absolute",
            left: "42px",
            bottom: "36px",
            zIndex: 5,
            textAlign: "left",
            color: "#fff",
            backgroundColor: "rgba(10, 16, 28, 0.52)",
            border: "1px solid rgba(255,255,255,0.24)",
            borderRadius: "16px",
            padding: "30px 36px",
            backdropFilter: "blur(3px)",
            maxWidth: "620px",
            boxShadow: "0 16px 45px rgba(0,0,0,0.35)",
            display: "grid",
            gap: "14px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: 0,
              color: "#d8c3a5",
              fontWeight: 700,
            }}
          >
            Archipelago Real Estate
          </p>
          <h2
            style={{
              fontSize: "40px",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              margin: "2px 0 4px",
              lineHeight: 1.2,
            }}
          >
            Professional Property Advisory
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#e5e7eb", lineHeight: 1.7 }}>
            Trusted support for buying, selling, and investing in Zanzibar real estate.
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-block",
              width: "fit-content",
              textDecoration: "none",
              backgroundColor: "#c49a6c",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "11px 18px",
              borderRadius: "8px",
            }}
          >
            Start Now
          </a>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="video-stats-row"
        style={{
          backgroundColor: "#1a1e2e",
          padding: "48px clamp(18px, 6vw, 80px)",
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
    </>
  );
}
