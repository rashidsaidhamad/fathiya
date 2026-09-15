"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  FaFacebookF,
  FaWhatsapp,
  FaTiktok,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserFriends,
  FaHandshake,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactMap = dynamic(() => import("../components/ContactMap"), { ssr: false });

const socialLinks = [
  { icon: <FaFacebookF size={14} />, href: "#" },
  { icon: <FaWhatsapp size={14} />, href: "#" },
  { icon: <FaTiktok size={14} />, href: "#" },
  { icon: <FaTwitter size={14} />, href: "#" },
  { icon: <FaLinkedinIn size={14} />, href: "#" },
  { icon: <FaInstagram size={14} />, href: "#" },
];

const referralOptions = [
  { label: "Facebook", icon: <FaFacebookF size={14} /> },
  { label: "Instagram", icon: <FaInstagram size={14} /> },
  { label: "From a Friend", icon: <FaUserFriends size={14} /> },
  { label: "TikTok", icon: <FaTiktok size={14} /> },
  { label: "Client", icon: <FaHandshake size={14} /> },
  { label: "LinkedIn", icon: <FaLinkedinIn size={14} /> },
];

export default function ContactPage() {
  const [referral, setReferral] = useState<string | null>(null);
  const [referralSubmitted, setReferralSubmitted] = useState(false);

  const inputStyle: React.CSSProperties = {
    padding: "12px 16px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    color: "var(--ink)",
    backgroundColor: "var(--surface)",
    transition: "border-color 0.2s",
  };

  return (
    <>
      <Navbar forceWhite />

      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: "320px",
          paddingTop: "110px",
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
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(12,13,20,0.68) 0%, rgba(12,13,20,0.58) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "0 20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <span style={{ color: "var(--accent-light)" }}>Contact Us</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "10px" }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto" }}>
            Questions about buying, selling, or investing in Zanzibar? Our team is ready to help.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
        {/* Info + Form */}
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "80px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "32px", alignItems: "start" }}>
            {/* Left: Contact info */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                padding: "44px 36px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src="/logo.webp"
                alt="Archipelago Real Estate"
                style={{ height: "48px", marginBottom: "24px", filter: "brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(300%) hue-rotate(10deg)" }}
              />
              <h2
                style={{
                  fontSize: "24px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "10px",
                }}
              >
                Archipelago Property Zanzibar
              </h2>
              <p style={{ color: "var(--ink-soft)", fontSize: "14px", lineHeight: 1.75, marginBottom: "28px" }}>
                We are here to help with land, property, and investment opportunities in Zanzibar —
                from your first inquiry to a signed deed.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
                {[
                  { icon: <FaMapMarkerAlt size={16} />, text: "Mlandege, Zanzibar Urban/West – Tanzania" },
                  { icon: <FaPhone size={15} />, text: "+255 659 740 712" },
                  { icon: <FaEnvelope size={15} />, text: "archipelagoproperties.zanzibar@gmail.com" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        backgroundColor: "var(--accent-soft)",
                        color: "var(--accent-dark)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span style={{ color: "var(--ink)", fontSize: "14px", fontWeight: 500, paddingTop: "8px" }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border)", marginBottom: "24px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
                  Opening Hours
                </h4>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "var(--ink-soft)", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>Monday – Saturday</span>
                  <span>08:30 – 15:30</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "var(--ink-soft)" }}>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="social-icon"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-dark)",
                      textDecoration: "none",
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Contact form */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                padding: "44px 40px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-dark)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Send a Message
              </div>
              <h2
                style={{
                  fontSize: "28px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "28px",
                }}
              >
                Tell Us What You're Looking For
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                {["Your Name", "Your Email", "Your Phone"].map((ph) => (
                  <input
                    key={ph}
                    placeholder={ph}
                    style={inputStyle}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                  />
                ))}
              </div>
              <textarea
                rows={6}
                placeholder="Your message"
                style={{ ...inputStyle, width: "100%", resize: "vertical", marginBottom: "20px" }}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              />
              <button
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  padding: "14px 34px",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
                  transition: "transform 0.25s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>

        {/* How did you hear about us? */}
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 40px 80px" }}>
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              padding: "44px 40px",
              boxShadow: "var(--shadow-sm)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "6px",
              }}
            >
              How did you hear about us?
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "28px" }}>(Optional)</p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              {referralOptions.map((opt) => {
                const selected = referral === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setReferral(opt.label);
                      setReferralSubmitted(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "11px 22px",
                      borderRadius: "var(--radius-pill)",
                      border: selected ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                      backgroundColor: selected ? "var(--accent-soft)" : "var(--background)",
                      color: selected ? "var(--accent-dark)" : "var(--ink-soft)",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "border-color 0.2s, background-color 0.2s, color 0.2s",
                    }}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <button
              disabled={!referral}
              onClick={() => setReferralSubmitted(true)}
              style={{
                background: referral
                  ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)"
                  : "var(--border)",
                color: referral ? "#fff" : "var(--muted)",
                border: "none",
                borderRadius: "var(--radius-pill)",
                padding: "13px 34px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: referral ? "pointer" : "not-allowed",
                boxShadow: referral ? "0 10px 24px rgba(196,154,108,0.3)" : "none",
                transition: "transform 0.25s",
              }}
              onMouseEnter={(e) => referral && ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              Submit Selection
            </button>

            {referralSubmitted && referral && (
              <p style={{ marginTop: "16px", fontSize: "13.5px", color: "var(--accent-dark)", fontWeight: 600 }}>
                Thanks — glad you found us through {referral}!
              </p>
            )}
          </div>
        </div>

        {/* Map */}
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 40px 100px" }}>
          <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <ContactMap />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
