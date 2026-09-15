"use client";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn, FaTiktok, FaSnapchatGhost, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useSiteContent } from "../hooks/useSiteContent";
import { toMailtoHref, toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

export default function ContactSection() {
  const content = useSiteContent();
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("source", "home");

    setFormStatus("Sending...");

    try {
      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
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

      setFormStatus(`Thanks! Your message was received.${deliveryText}`);
      form.reset();
    } catch {
      setFormStatus("Could not send right now. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "12px 14px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    color: "var(--ink)",
    backgroundColor: "#fff",
    transition: "border-color 0.2s",
  };

  return (
    <section
      className="contact-home-root"
      style={{
        position: "relative",
        minHeight: "500px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        padding: "100px clamp(18px, 6vw, 80px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(120deg, rgba(11,12,19,0.82) 0%, rgba(11,12,19,0.55) 100%)",
        }}
      />

      <div className="contact-home-inner" style={{ position: "relative", zIndex: 5, display: "flex", gap: "60px", width: "100%", alignItems: "center", flexWrap: "wrap" }}>
        {/* Contact Form Card */}
        <div
          className="contact-home-form-card glass"
          style={{
            borderRadius: "var(--radius-lg)",
            padding: "40px",
            width: "480px",
            maxWidth: "100%",
            flexShrink: 0,
            boxShadow: "var(--shadow-lg)",
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
            Get In Touch
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontFamily: "var(--font-display)",
              color: "var(--ink)",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            Contact Form
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="contact-home-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                Last name*
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  required
                  style={inputStyle}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                First name*
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  required
                  style={inputStyle}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                Email*
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  style={inputStyle}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)" }}>
                Mobile
                <input
                  type="text"
                  name="phone"
                  placeholder="+255"
                  style={inputStyle}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                />
              </label>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--ink-soft)", marginBottom: "16px" }}>
              Message
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                required
                style={{ ...inputStyle, width: "100%", resize: "vertical" }}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              />
            </label>
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: formStatus.includes("Could not") ? "#b42318" : "#276749" }}>
              {formStatus}
            </p>
          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "#fff",
              border: "none",
              padding: "14px 28px",
              borderRadius: "var(--radius-pill)",
              fontSize: "14.5px",
              cursor: "pointer",
              fontWeight: 700,
              width: "100%",
              boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
              transition: "transform 0.25s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          >
            Send Email
          </button>
          </form>
        </div>

        {/* Right contact info */}
        <div className="contact-home-info" style={{ color: "#fff", flex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 40px)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "36px",
            }}
          >
            In need of support?
            <br />
            Get in touch!
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(196,154,108,0.22)", color: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FaMapMarkerAlt size={16} />
              </span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", paddingTop: "8px" }}>Mlandege, Zanzibar Urban/West – Tanzania</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(196,154,108,0.22)", color: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FaEnvelope size={15} />
              </span>
              <a href={toMailtoHref(content.contactActions.email)} style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", textDecoration: "none" }}>
                {content.contactActions.email}
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(196,154,108,0.22)", color: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FaPhone size={15} />
              </span>
              <a href={toTelHref(content.contactActions.phone)} style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", textDecoration: "none" }}>
                {content.contactActions.phone}
              </a>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
              {[
                  { icon: <FaFacebookF size={14} />, href: "#", title: "Facebook" },
                  { icon: <FaInstagram size={14} />, href: "#", title: "Instagram" },
                  {
                    icon: <FaWhatsapp size={14} />,
                    href: toWhatsAppHref(content.contactActions.whatsapp, content.contactActions.whatsappMessage),
                    title: "WhatsApp",
                  },
                  { icon: <FaLinkedinIn size={14} />, href: "#", title: "LinkedIn" },
                  { icon: <FaTiktok size={14} />, href: "#", title: "TikTok" },
                  { icon: <FaSnapchatGhost size={14} />, href: "#", title: "Snapchat" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                    title={s.title}
                  className="social-icon"
                  target={s.title === "WhatsApp" ? "_blank" : undefined}
                  rel={s.title === "WhatsApp" ? "noreferrer" : undefined}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.2)",
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
        </div>
      </div>

      {/* Scroll to top & email buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button
          type="button"
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            color: "var(--accent-dark)",
          }}
          onClick={() => (window.location.href = toMailtoHref(content.contactActions.email))}
        >
          ✉
        </button>
        <button
          type="button"
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            color: "var(--accent-dark)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .contact-home-inner {
            gap: 32px !important;
          }

          .contact-home-form-card {
            width: 100% !important;
            padding: 28px !important;
          }

          .contact-home-info h2 {
            font-size: 30px !important;
            margin-bottom: 24px !important;
          }
        }

        @media (max-width: 640px) {
          .contact-home-root {
            min-height: auto !important;
            padding: 48px 16px !important;
          }

          .contact-home-inner {
            gap: 24px !important;
          }

          .contact-home-form-card {
            padding: 20px !important;
            border-radius: 20px !important;
          }

          .contact-home-form-grid {
            grid-template-columns: 1fr !important;
          }

          .contact-home-form-card h2 {
            font-size: 20px !important;
            margin-bottom: 18px !important;
          }

          .contact-home-info h2 {
            font-size: 24px !important;
            margin-bottom: 18px !important;
          }

          .contact-home-info a,
          .contact-home-info span {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
