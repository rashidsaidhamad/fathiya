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
  const socialLinks = [
    { icon: <FaFacebookF size={15} />, href: "https://www.facebook.com/share/18dtiBWTnj/", title: "Facebook" },
    { icon: <FaInstagram size={15} />, href: "https://www.instagram.com/archipelago_properties?igsh=dHQ0NnVrbmxqbno0", title: "Instagram" },
    {
      icon: <FaWhatsapp size={15} />,
      href: "https://wa.me/message/DSUFKUBMIL5HN1",
      title: "WhatsApp",
    },
    { icon: <FaLinkedinIn size={15} />, href: "#", title: "LinkedIn" },
    { icon: <FaTiktok size={15} />, href: "https://www.tiktok.com/@archipelago_properties?_r=1&_t=ZS-95AoJGjwiRR", title: "TikTok" },
    { icon: <FaSnapchatGhost size={15} />, href: "https://www.snapchat.com/add/archipelago2026?share_id=VqMRxcOy5XA&locale=en-GB", title: "Snapchat" },
  ];

  return (
    <footer
      className="footer-root"
      style={{
        backgroundColor: "#1a1e2e",
        color: "#ccc",
        padding: "60px clamp(18px, 6vw, 80px) 0",
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr",
          gap: "60px",
          paddingBottom: "40px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Col 1 - Company */}
        <div>
          <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, marginBottom: "14px" }}>
            Archipelago Property Zanzibar
          </h3>
          <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#aaa", marginBottom: "20px", maxWidth: "300px" }}>
            Archipelago Property Zanzibar Company Ltd is a trusted real estate company offering
            land, property, and investment support in Zanzibar.
          </p>
          <p style={{ color: "#fff", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
            SOCIAL LINKS:
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                title={s.title}
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "4px",
                  backgroundColor: "#c49a6c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
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
          <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>
            CONTACT
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <FaMapMarkerAlt color="#c49a6c" size={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.7 }}>Mlandege, Zanzibar Urban/West – Tanzania</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaPhone color="#c49a6c" size={14} />
              <a href={toTelHref(content.contactActions.phone)} style={{ fontSize: "13px", color: "#aaa", textDecoration: "none" }}>
                {content.contactActions.phone}
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaPhone color="#c49a6c" size={14} />
              <a href={toTelHref("+255659741770")} style={{ fontSize: "13px", color: "#aaa", textDecoration: "none" }}>
                +255659741770
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaEnvelope color="#c49a6c" size={14} />
              <a href={toMailtoHref(content.contactActions.email)} style={{ fontSize: "13px", color: "#aaa", textDecoration: "none" }}>
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
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            QUICK LINKS
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c49a6c")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#aaa")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="footer-bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
        }}
      >
        <p style={{ fontSize: "12px", color: "#666" }}>Copyright. All Rights Reserved.</p>
        <div style={{ display: "flex", gap: "20px" }}>
          {policyLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c49a6c")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#666")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
