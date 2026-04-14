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
      ref={ref}
      style={{
        width: "100%",
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "80px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "60px",
        backgroundColor: "#fff",
      }}
    >
      {/* Left Text */}
      <div
        style={{
          flex: 1,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(-40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <p
          style={{
            color: "#c49a6c",
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>⊞</span> {content.homePage.aboutBadge}
        </p>
        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Georgia, serif",
            color: "#222",
            marginBottom: "20px",
            lineHeight: 1.2,
          }}
        >
          {content.homePage.aboutTitleLine1}
          <br />
          {content.homePage.aboutTitleLine2}
        </h2>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "10px", lineHeight: 1.7 }}>
          {content.homePage.aboutIntroLine1}
        </p>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "10px", lineHeight: 1.7 }}>
          {content.homePage.aboutIntroLine2}
        </p>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px", lineHeight: 1.7 }}>
          {content.homePage.aboutIntroLine3}
        </p>
        {content.homePage.aboutChecklist.map((item) => (
          <p key={item} style={{ color: "#555", fontSize: "14px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#c49a6c", fontWeight: "bold" }}>✓</span> {item}
          </p>
        ))}
        <p style={{ color: "#555", fontSize: "14px", marginTop: "16px", marginBottom: "28px" }}>
          Begin your property journey today, we are ready to assist you.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link
            href="/company"
            style={{
              backgroundColor: "#c49a6c",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            About Us
          </Link>
          <a
            href={toWhatsAppHref(content.contactActions.whatsapp, content.contactActions.whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: "transparent",
              color: "#333",
              border: "1.5px solid #333",
              padding: "12px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Right Image Grid */}
      <div
        style={{
          flex: 0.94,
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
        {/* For Rent image */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "16px",
            width: "44%",
            height: "530px",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
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
              top: "16px",
              left: "18px",
              color: "#fff",
              fontSize: "20px",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontWeight: 400,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            For Rent
          </div>
        </div>

        {/* For Sale image */}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            width: "44%",
            height: "530px",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
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
              top: "16px",
              left: "18px",
              color: "#fff",
              fontSize: "20px",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontWeight: 400,
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
