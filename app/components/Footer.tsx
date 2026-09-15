"use client";
import { FaFacebookF, FaWhatsapp, FaTiktok, FaGoogle, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const socialLinks = [
  { icon: <FaFacebookF size={14} />, href: "#", title: "Facebook" },
  { icon: <FaWhatsapp size={14} />, href: "#", title: "WhatsApp" },
  { icon: <FaTiktok size={14} />, href: "#", title: "TikTok" },
  { icon: <FaTwitter size={14} />, href: "#", title: "Twitter" },
  { icon: <FaGoogle size={14} />, href: "#", title: "Google" },
  { icon: <FaInstagram size={14} />, href: "#", title: "Instagram" },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--navy)",
        color: "#ccc",
        padding: "80px 80px 0",
      }}
    >
      <div
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
          <div style={{ display: "flex", gap: "10px" }}>
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                title={s.title}
                className="social-icon"
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
              <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)" }}>+255 659 740 712</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaEnvelope color="var(--accent-light)" size={13} />
              <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)" }}>info@archipelagoestates.com</span>
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
            {["About", "Site Map", "Support Center", "Terms Conditions"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--accent-light)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 0",
        }}
      >
        <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.35)" }}>Copyright. All Rights Reserved.</p>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="#" style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Terms of Use</a>
          <a href="#" style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
