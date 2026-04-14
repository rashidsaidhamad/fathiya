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
        padding: "80px clamp(18px, 6vw, 80px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      />

      <div className="contact-home-inner" style={{ position: "relative", zIndex: 5, display: "flex", gap: "60px", width: "100%", alignItems: "center", flexWrap: "wrap" }}>
        {/* Contact Form Card */}
        <div
          className="contact-home-form-card"
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "40px",
            width: "480px",
            maxWidth: "100%",
            flexShrink: 0,
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontFamily: "Georgia, serif",
              color: "#222",
              marginBottom: "24px",
            }}
          >
            Contact Form
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="contact-home-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555" }}>
                Last name*
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  required
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#555",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555" }}>
                First name*
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  required
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#555",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555" }}>
                Email*
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#555",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555" }}>
                Mobile
                <input
                  type="text"
                  name="phone"
                  placeholder="+255"
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#555",
                  }}
                />
              </label>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555", marginBottom: "14px" }}>
              Message
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  color: "#555",
                }}
              />
            </label>
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: formStatus.includes("Could not") ? "#b42318" : "#276749" }}>
              {formStatus}
            </p>
          <button
            type="submit"
            style={{
              backgroundColor: "#c49a6c",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
              width: "100%",
            }}
          >
            Send Email
          </button>
          </form>
        </div>

        {/* Right contact info */}
        <div style={{ color: "#fff", flex: 1 }}>
          <h2
            style={{
              fontSize: "36px",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "32px",
            }}
          >
            In need of support?
            <br />
            Get in touch!
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <FaMapMarkerAlt color="#c49a6c" size={18} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ color: "#ddd", fontSize: "15px" }}>Mlandege, Zanzibar Urban/West – Tanzania</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaEnvelope color="#c49a6c" size={16} />
              <a href={toMailtoHref(content.contactActions.email)} style={{ color: "#ddd", fontSize: "15px", textDecoration: "none" }}>
                {content.contactActions.email}
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaPhone color="#c49a6c" size={16} />
              <a href={toTelHref(content.contactActions.phone)} style={{ color: "#ddd", fontSize: "15px", textDecoration: "none" }}>
                {content.contactActions.phone}
              </a>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
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
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "rgba(196,154,108,0.8)",
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
          bottom: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button
          type="button"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={() => (window.location.href = toMailtoHref(content.contactActions.email))}
        >
          ✉
        </button>
        <button
          type="button"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>
    </section>
  );
}
