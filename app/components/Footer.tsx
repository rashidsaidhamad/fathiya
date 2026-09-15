"use client";
import Link from "next/link";
import { FaFacebookF, FaWhatsapp, FaTiktok, FaInstagram, FaLinkedinIn, FaSnapchatGhost, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useSiteContent } from "../hooks/useSiteContent";
import { toMailtoHref, toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

const quickLinks = [
  { label: "About", href: "/company" },
  { label: "Site Map", href: "/site-map" },
  { label: "Support Center", href: "/contact" },
  { label: "Terms Conditions", href: "/terms" },
];

const policyLinks = [
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export default function Footer() {
  const content = useSiteContent();
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: <FaFacebookF size={14} />, href: "https://www.facebook.com/share/18dtiBWTnj/", title: "Facebook" },
    { icon: <FaInstagram size={14} />, href: "https://www.instagram.com/archipelago_properties?igsh=dHQ0NnVrbmxqbno0", title: "Instagram" },
    {
      icon: <FaWhatsapp size={14} />,
      href: "https://wa.me/message/DSUFKUBMIL5HN1",
      title: "WhatsApp",
    },
    { icon: <FaLinkedinIn size={14} />, href: "#", title: "LinkedIn" },
    { icon: <FaTiktok size={14} />, href: "https://www.tiktok.com/@archipelago_properties?_r=1&_t=ZS-95AoJGjwiRR", title: "TikTok" },
    { icon: <FaSnapchatGhost size={14} />, href: "https://www.snapchat.com/add/archipelago2026?share_id=VqMRxcOy5XA&locale=en-GB", title: "Snapchat" },
  ];

  return (
    <footer
      className="footer-root"
      style={{
        backgroundColor: "var(--navy)",
        color: "#ccc",
        padding: "80px clamp(18px, 6vw, 80px) 0",
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr",
          gap: "60px",
          paddingBottom: "48px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Col 1 - Company */}
        <div>
          <h3 style={{ color: "#fff", fontSize: "18px", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "16px" }}>
            Archipelago Property Zanzibar
          </h3>
          <p style={{ fontSize: "13.5px", lineHeight: 1.85, color: "rgba(255,255,255,0.55)", marginBottom: "24px", maxWidth: "300px" }}>
            Archipelago Property Zanzibar Company Ltd is a trusted real estate company offering
            land, property, and investment support in Zanzibar.
          </p>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "11.5px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px", fontWeight: 700 }}>
            Social Links
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                title={s.title}
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(196,154,108,0.14)",
                  border: "1px solid rgba(196,154,108,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-light)",
                  textDecoration: "none",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 - Contact */}
        <div>
          <h3 style={{ color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "22px" }}>
            Contact
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <FaMapMarkerAlt color="var(--accent-light)" size={15} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>Mlandege, Zanzibar Urban/West – Tanzania</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaPhone color="var(--accent-light)" size={13} />
              <a href={toTelHref(content.contactActions.phone)} style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                {content.contactActions.phone}
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaPhone color="var(--accent-light)" size={13} />
              <a href={toTelHref("+255659741770")} style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                +255659741770
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaEnvelope color="var(--accent-light)" size={13} />
              <a href={toMailtoHref(content.contactActions.email)} style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                {content.contactActions.email}
              </a>
            </div>
          </div>
        </div>

        {/* Col 3 - Quick Links */}
        <div>
          <h3
            style={{
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "22px",
            }}
          >
            Quick Links
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-light)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright + policies */}
      <div
        className="footer-bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 0",
        }}
      >
        <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.35)" }}>
          © {currentYear} Archipelago Property Zanzibar. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {policyLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-light)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
