"use client";
import { FaFacebookF, FaWhatsapp, FaTiktok, FaGoogle, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const socialLinks = [
  { icon: <FaFacebookF size={15} />, href: "#", title: "Facebook" },
  { icon: <FaWhatsapp size={15} />, href: "#", title: "WhatsApp" },
  { icon: <FaTiktok size={15} />, href: "#", title: "TikTok" },
  { icon: <FaTwitter size={15} />, href: "#", title: "Twitter" },
  { icon: <FaGoogle size={15} />, href: "#", title: "Google" },
  { icon: <FaInstagram size={15} />, href: "#", title: "Instagram" },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1a1e2e",
        color: "#ccc",
        padding: "60px 80px 0",
      }}
    >
      <div
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
              <span style={{ fontSize: "13px", color: "#aaa" }}>+255 659 740 712</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaEnvelope color="#c49a6c" size={14} />
              <span style={{ fontSize: "13px", color: "#aaa" }}>info@archipelagoestates.com</span>
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
            {["About", "Site Map", "Support Center", "Terms Conditions"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#c49a6c")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#aaa")}
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
          padding: "18px 0",
        }}
      >
        <p style={{ fontSize: "12px", color: "#666" }}>Copyright. All Rights Reserved.</p>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>Terms of Use</a>
          <a href="#" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
