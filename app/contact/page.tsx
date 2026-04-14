"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaFacebookF, FaWhatsapp, FaTiktok, FaInstagram, FaSnapchatGhost } from "react-icons/fa";
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

  return (
    <>
      <Navbar forceWhite />
      <div style={{ paddingTop: "70px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Map */}
        <ContactMap />

        {/* Page content */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
            <a href="/" style={{ color: "#555", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 6px", color: "#aaa" }}>›</span>
            <span style={{ color: "#c49a6c", fontWeight: 600 }}>Contact Us</span>
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>
            {/* Left: Contact info + form */}
            <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "36px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a2e", marginBottom: "6px" }}>
                Archipelago Properties Zanzibar
              </h1>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
                Mlandege, Zanzibar Urban/West – Tanzania
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: 30, height: 30,
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#555", textDecoration: "none",
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#c49a6c";
                      (e.currentTarget as HTMLElement).style.color = "#c49a6c";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
                      (e.currentTarget as HTMLElement).style.color = "#555";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Contact details */}
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px 0", fontSize: "14px", marginBottom: "20px" }}>
                <span style={{ color: "#888" }}>Phone:</span>
                <a href={toTelHref(content.contactActions.phone)} style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>{content.contactActions.phone}</a>
                <span style={{ color: "#888" }}>Mobile:</span>
                <a href={toTelHref(content.contactActions.phone)} style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>{content.contactActions.phone}</a>
                <span style={{ color: "#888" }}>Email:</span>
                <a href={toMailtoHref(content.contactActions.email)} style={{ color: "#c49a6c", textDecoration: "none", fontWeight: 500 }}>
                  {content.contactActions.email}
                </a>
              </div>

              {/* Description */}
              <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic", borderLeft: "3px solid #c49a6c", paddingLeft: "12px" }}>
                We are here to help you with land, property, and investment opportunities in Zanzibar.
                Whether you want to buy land, sell or rent a property, or need legal and investment support, our team is ready to assist you
              </p>

              {/* Logo */}
              <div style={{ marginBottom: "28px" }}>
                <img src="/logo.webp" alt="Archipelago Real Estate" style={{ height: "60px", filter: "brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(300%)" }} />
              </div>

              {/* Contact form */}
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>
                Contact Me
              </h3>
              <form id="contact-form" onSubmit={handleSubmit}>
                <input type="hidden" name="source" value="contact" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555" }}>
                  Last name*
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    required
                    style={{
                      padding: "10px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "13px",
                      outline: "none",
                      color: "#333",
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
                      padding: "10px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "13px",
                      outline: "none",
                      color: "#333",
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
                      padding: "10px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "13px",
                      outline: "none",
                      color: "#333",
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
                      padding: "10px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "13px",
                      outline: "none",
                      color: "#333",
                    }}
                  />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555", marginBottom: "14px" }}>
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Message"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "13px",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#333",
                  }}
                />
              </label>
              <button
                  type="submit"
                style={{
                  backgroundColor: "#c49a6c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "11px 28px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a07850")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#c49a6c")}
              >
                Send Email
              </button>
                <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>{status}</p>
              </form>
            </div>

            {/* Right: How did you hear about us? */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* How did you hear about us form */}
              <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>
                  How did you hear about us?
                </h3>
                <p style={{ fontSize: "12px", color: "#888", marginBottom: "14px", fontStyle: "italic" }}>
                  (Optional)
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {hearAboutUsOptions.map((option) => (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#333",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="hearAboutUs"
                        form="contact-form"
                        value={option}
                        checked={hearAboutUs.includes(option)}
                        onChange={() => toggleHearAboutUs(option)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          accentColor: "#c49a6c",
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={submitHearAboutUs}
                  style={{
                    marginTop: "14px",
                    backgroundColor: "#c49a6c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Submit Selection
                </button>
                <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#666" }}>{hearAboutUsStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
