"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaFacebookF, FaWhatsapp, FaTiktok, FaInstagram, FaSnapchatGhost, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSiteContent } from "../hooks/useSiteContent";
import { toMailtoHref, toTelHref } from "../../lib/contactLinks";

const ContactMap = dynamic(() => import("../components/ContactMap"), { ssr: false });

const socialLinks = [
  { icon: <FaFacebookF size={14} />, href: "https://www.facebook.com/share/18dtiBWTnj/", title: "Facebook" },
  { icon: <FaWhatsapp size={14} />, href: "https://wa.me/message/DSUFKUBMIL5HN1", title: "WhatsApp" },
  { icon: <FaTiktok size={14} />, href: "https://www.tiktok.com/@archipelago_properties?_r=1&_t=ZS-95AoJGjwiRR", title: "TikTok" },
  { icon: <FaInstagram size={14} />, href: "https://www.instagram.com/archipelago_properties?igsh=dHQ0NnVrbmxqbno0", title: "Instagram" },
  { icon: <FaSnapchatGhost size={14} />, href: "https://www.snapchat.com/add/archipelago2026?share_id=VqMRxcOy5XA&locale=en-GB", title: "Snapchat" },
];

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState<string[]>([]);
  const [hearAboutUsStatus, setHearAboutUsStatus] = useState("");
  const content = useSiteContent();
  const companyLogoUrl = content.homePage.companyLogoUrl?.trim() || "/logo.webp";
  const hearAboutUsOptions = content.contactFormSettings?.hearAboutUsOptions ?? [
    "Facebook",
    "Instagram",
    "TikTok",
    "LinkedIn",
    "Google Search",
    "Word of Mouth",
    "A Friend",
    "Previous Client",
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("Sending...");

    const response = await fetch("/api/contact-submissions", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setStatus("Could not send. Please try again.");
      return;
    }

    const payload = (await response.json()) as {
      emailRouting?: {
        to?: string;
        from?: string;
        sent?: boolean;
      };
    };
    const emailRouting = payload.emailRouting;
    const deliveryText = emailRouting
      ? ` Sent to: ${emailRouting.to ?? "-"}. Sent from: ${emailRouting.from ?? "-"}.${emailRouting.sent ? "" : " SMTP is not configured yet."}`
      : "";

    setStatus(`Thanks! Your message was received.${deliveryText}`);
    setHearAboutUs([]);
    form.reset();
  };

  const toggleHearAboutUs = (option: string) => {
    setHearAboutUs((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const submitHearAboutUs = async () => {
    if (hearAboutUs.length === 0) {
      setHearAboutUsStatus("Please select at least one option.");
      return;
    }

    setHearAboutUsStatus("Submitting...");
    const response = await fetch("/api/contact-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "contact",
        hearAboutUs,
      }),
    });

    if (!response.ok) {
      setHearAboutUsStatus("Could not submit. Please try again.");
      return;
    }

    setHearAboutUsStatus("Thank you. Your selection was submitted.");
    setHearAboutUs([]);
  };

  const inputStyle: React.CSSProperties = {
    padding: "12px 14px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: "13.5px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    color: "var(--ink)",
    backgroundColor: "#fff",
  };

  return (
    <>
      <Navbar forceWhite />

      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: "300px",
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
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 46px)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "10px" }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto" }}>
            Questions about buying, selling, or investing in Zanzibar? Our team is ready to help.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
        {/* Page content */}
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "clamp(28px, 4vw, 44px) clamp(14px, 3vw, 40px)" }}>
          {/* Two-column layout */}
          <div className="contact-page-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "28px", alignItems: "start" }}>
            {/* Left: Contact info + form */}
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "clamp(24px, 4vw, 40px)", boxShadow: "var(--shadow-sm)" }}>
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
              <h1 style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
                Archipelago Properties Zanzibar
              </h1>
              <p style={{ color: "var(--ink-soft)", fontSize: "14px", marginBottom: "18px" }}>
                Mlandege, Zanzibar Urban/West – Tanzania
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon"
                    style={{
                      width: 36, height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-soft)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--accent-dark)", textDecoration: "none",
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "var(--accent-soft)", color: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FaPhone size={13} />
                  </span>
                  <a href={toTelHref(content.contactActions.phone)} style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none", fontSize: "14px" }}>{content.contactActions.phone}</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "var(--accent-soft)", color: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FaPhone size={13} />
                  </span>
                  <a href={toTelHref("+255659741770")} style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none", fontSize: "14px" }}>+255659741770</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "var(--accent-soft)", color: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FaEnvelope size={13} />
                  </span>
                  <a href={toMailtoHref(content.contactActions.email)} style={{ color: "var(--accent-dark)", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
                    {content.contactActions.email}
                  </a>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: "13.5px", color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: "24px", borderLeft: "3px solid var(--accent)", paddingLeft: "14px" }}>
                We are here to help you with land, property, and investment opportunities in Zanzibar.
                Whether you want to buy land, sell or rent a property, or need legal and investment support, our team is ready to assist you.
              </p>

              {/* Logo */}
              <div style={{ marginBottom: "28px" }}>
                <img
                  src={companyLogoUrl}
                  alt="Archipelago Real Estate"
                  style={{ height: "52px", filter: "brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(300%)" }}
                />
              </div>

              {/* Contact form */}
              <h3 style={{ fontSize: "18px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", marginBottom: "18px" }}>
                Contact Me
              </h3>
              <form id="contact-form" onSubmit={handleSubmit}>
                <input type="hidden" name="source" value="contact" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                  Last name*
                  <input type="text" name="lastName" placeholder="Last name" required style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                  First name*
                  <input type="text" name="firstName" placeholder="First name" required style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                  Email*
                  <input type="email" name="email" placeholder="Email" required style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                  Mobile
                  <input type="text" name="phone" placeholder="+255" style={inputStyle} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)", marginBottom: "16px" }}>
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Message"
                  required
                  style={{ ...inputStyle, width: "100%", resize: "vertical", boxSizing: "border-box" }}
                />
              </label>
              <button
                  type="submit"
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  padding: "13px 30px",
                  fontSize: "14px",
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
                <p style={{ marginTop: "12px", fontSize: "12.5px", color: "var(--ink-soft)" }}>{status}</p>
              </form>
            </div>

            {/* Right: How did you hear about us? */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ backgroundColor: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "26px", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ fontSize: "17px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
                  How did you hear about us?
                </h3>
                <p style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "18px" }}>
                  (Optional)
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {hearAboutUsOptions.map((option) => {
                    const selected = hearAboutUs.includes(option);
                    return (
                      <label
                        key={option}
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "9px 16px",
                          borderRadius: "var(--radius-pill)",
                          border: selected ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                          backgroundColor: selected ? "var(--accent-soft)" : "var(--background)",
                          color: selected ? "var(--accent-dark)" : "var(--ink-soft)",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          userSelect: "none",
                          transition: "border-color 0.2s, background-color 0.2s, color 0.2s",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="hearAboutUs"
                          form="contact-form"
                          value={option}
                          checked={selected}
                          onChange={() => toggleHearAboutUs(option)}
                          style={{
                            position: "absolute",
                            opacity: 0,
                            width: 1,
                            height: 1,
                            pointerEvents: "none",
                          }}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={submitHearAboutUs}
                  style={{
                    marginTop: "20px",
                    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "var(--radius-pill)",
                    padding: "12px 20px",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                    boxShadow: "0 10px 20px rgba(196,154,108,0.3)",
                  }}
                >
                  Submit Selection
                </button>
                <p style={{ margin: "10px 0 0", fontSize: "12.5px", color: "var(--ink-soft)" }}>{hearAboutUsStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(14px, 3vw, 40px) clamp(40px, 6vw, 100px)" }}>
          <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <ContactMap />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
