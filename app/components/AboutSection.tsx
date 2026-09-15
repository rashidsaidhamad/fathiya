"use client";
import { useInView } from "../hooks/useInView";
import Link from "next/link";
import { useSiteContent } from "../hooks/useSiteContent";
import { toWhatsAppHref } from "../../lib/contactLinks";

export default function AboutSection() {
  const { ref, inView } = useInView();
  const content = useSiteContent();

  return (
    <section
      className="about-root"
      ref={ref}
      style={{
        width: "100%",
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "100px 32px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "70px",
        backgroundColor: "var(--surface)",
      }}
    >
      {/* Left Text */}
      <div
        className="about-text"
        style={{
          flex: 1,
          minWidth: "300px",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(-40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
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
            marginBottom: "22px",
          }}
        >
          {content.homePage.aboutBadge}
        </div>
        <h2
          style={{
            fontSize: "42px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "22px",
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
          }}
        >
          {content.homePage.aboutTitleLine1}
          <br />
          {content.homePage.aboutTitleLine2}
        </h2>
        <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "12px", lineHeight: 1.75 }}>
          {content.homePage.aboutIntroLine1}
        </p>
        <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "12px", lineHeight: 1.75 }}>
          {content.homePage.aboutIntroLine2}
        </p>
        <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "24px", lineHeight: 1.75 }}>
          {content.homePage.aboutIntroLine3}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "8px" }}>
          {content.homePage.aboutChecklist.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-dark)",
                  fontSize: "12px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span style={{ color: "var(--ink)", fontSize: "14.5px", fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: "14.5px", marginTop: "20px", marginBottom: "32px", lineHeight: 1.7 }}>
          Begin your property journey today, we are ready to assist you.
        </p>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <Link
            href="/company"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "#fff",
              border: "none",
              padding: "14px 30px",
              borderRadius: "var(--radius-pill)",
              fontSize: "14.5px",
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
              transition: "transform 0.25s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          >
            About Us
          </Link>
          <a
            href={toWhatsAppHref(content.contactActions.whatsapp, content.contactActions.whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: "transparent",
              color: "var(--ink)",
              border: "1.5px solid var(--border)",
              padding: "14px 30px",
              borderRadius: "var(--radius-pill)",
              fontSize: "14.5px",
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "border-color 0.25s ease, color 0.25s ease",
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
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Right Image Grid */}
      <div
        className="about-images"
        style={{
          flex: 0.94,
          minWidth: "300px",
          position: "relative",
          minHeight: "540px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(40px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "0%",
            top: "-20px",
            width: "46%",
            height: "70%",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, var(--accent-light), var(--accent))",
            opacity: 0.22,
          }}
        />
        {/* For Rent image */}
        <div
          className="hover-lift"
          style={{
            position: "absolute",
            left: "6%",
            top: "16px",
            width: "44%",
            height: "530px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.5) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "18px",
              left: "18px",
              color: "#fff",
              fontSize: "20px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            For Rent
          </div>
        </div>

        {/* For Sale image */}
        <div
          className="hover-lift"
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            width: "44%",
            height: "530px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
            border: "6px solid var(--surface)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.5) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "18px",
              left: "18px",
              color: "#fff",
              fontSize: "20px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            For Sale
          </div>
        </div>
      </div>
    </section>
  );
}
