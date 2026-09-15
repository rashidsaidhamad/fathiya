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
  const posterImage = content.videoSection.backgroundImage;
  const clipDurationSeconds = 25;
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
  }, [videoSrc]);

  function handleVideoTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    if (video.currentTime >= clipDurationSeconds) {
      video.currentTime = 0;
      void video.play();
    }
  }

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
        {videoSrc && !videoFailed ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={posterImage}
            onError={() => setVideoFailed(true)}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              video.play().catch(() => {
                console.log("Video autoplay blocked on this device");
              });
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55)",
            } as React.CSSProperties & { WebkitPlaysinline?: string }}
            data-webkit-playsinline="true"
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
              filter: "brightness(0.55)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(11,12,19,0.35) 0%, transparent 55%)",
          }}
        />
        <div
          className="video-overlay-card glass-dark"
          style={{
            position: "absolute",
            left: "42px",
            bottom: "36px",
            zIndex: 5,
            textAlign: "left",
            color: "#fff",
            borderRadius: "var(--radius-md)",
            padding: "32px 38px",
            maxWidth: "620px",
            boxShadow: "var(--shadow-lg)",
            display: "grid",
            gap: "14px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: 0,
              color: "var(--accent-light)",
              fontWeight: 700,
            }}
          >
            Archipelago Real Estate
          </p>
          <h2
            style={{
              fontSize: "40px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              margin: "2px 0 4px",
              lineHeight: 1.2,
            }}
          >
            Zanzibar Real Estate Business
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
            Trusted property advisory for buying, selling, and investment opportunities across Zanzibar.
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              textDecoration: "none",
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              padding: "12px 22px",
              borderRadius: "var(--radius-pill)",
              boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
              transition: "transform 0.25s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          >
            Start Now
          </a>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="video-stats-row"
        style={{
          backgroundColor: "var(--navy)",
          padding: "56px clamp(18px, 6vw, 80px)",
          display: "flex",
          justifyContent: "center",
          gap: "80px",
        }}
      >
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: "center", maxWidth: "220px" }}>
            <p
              style={{
                fontSize: "44px",
                color: "var(--accent-light)",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                marginBottom: "12px",
              }}
            >
              <AnimatedNumber numeric={stat.numeric} suffix={stat.suffix} decimal={stat.decimal} />
            </p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.7 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
