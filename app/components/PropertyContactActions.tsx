"use client";

import { useState } from "react";
import { FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";
import { toMailtoHref, toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

type PropertyContactActionsProps = {
  propertyTitle: string;
  propertyLocation: string;
  contactPersonName: string;
  contactPersonImage?: string;
  phoneNumbers: string[];
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
};

export default function PropertyContactActions({
  propertyTitle,
  propertyLocation,
  contactPersonName,
  contactPersonImage,
  phoneNumbers,
  email,
  whatsappNumber,
  whatsappMessage,
}: PropertyContactActionsProps) {
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function submitEmailForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !emailValue.trim() || !message.trim()) {
      setStatus("Please fill in your name, email, and message.");
      return;
    }

    if (phone && !/^[1-9]\d{7,14}$/.test(phone.trim())) {
      setStatus("Please enter a valid phone number starting with country code (digits only, e.g. 255772818324).");
      return;
    }

    setBusy(true);
    setStatus("Sending...");

    try {
      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name: name.trim(),
          email: emailValue.trim(),
          phone: phone.trim(),
          recipientEmail: email.trim(),
          message: `Agent: ${contactPersonName}\nProperty enquiry for: ${propertyTitle}\nLocation: ${propertyLocation}\nContact email: ${email}\n\n${message.trim()}`,
          hearAboutUs: [],
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus(payload?.error ?? "Could not send message.");
        setBusy(false);
        return;
      }

      setStatus("Message sent successfully.");
      setName("");
      setEmailValue("");
      setPhone("");
      setMessage("");
      setBusy(false);
      setTimeout(() => setShowEmailForm(false), 900);
    } catch {
      setStatus("Could not send message.");
      setBusy(false);
    }
  }

  return (
    <>
      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <button
          type="button"
          onClick={() => setShowCallOptions(true)}
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#111827", background: "#f9fafb", borderRadius: 14, padding: 14, border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--accent-dark)" }}><FaPhone /></span>
          <span>Call Agent</span>
        </button>

        <button
          type="button"
          onClick={() => setShowEmailForm(true)}
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#111827", background: "#f9fafb", borderRadius: 14, padding: 14, border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--accent-dark)" }}><FaEnvelope /></span>
          <span>Email Agent</span>
        </button>

        <a
          href={toWhatsAppHref(whatsappNumber, whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#111827", background: "#f9fafb", borderRadius: 14, padding: 14 }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#25D366" }}><FaWhatsapp /></span>
          <span>WhatsApp Agent</span>
        </a>
      </div>

      {showCallOptions ? (
        <div
          onClick={() => setShowCallOptions(false)}
          style={{ position: "fixed", inset: 0, zIndex: 5100, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 20 }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.25)", display: "grid", gap: 12 }}>
            <div>
              <p style={{ margin: 0, color: "var(--accent-dark)", fontWeight: 800 }}>Call</p>
              <h3 style={{ margin: "6px 0 0", fontSize: 22, fontFamily: "var(--font-display)", color: "#111827" }}>Choose a number</h3>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {phoneNumbers.map((number) => (
                <a
                  key={number}
                  href={toTelHref(number)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, background: "#f9fafb", color: "#111827", textDecoration: "none", fontWeight: 700 }}
                >
                  <FaPhone color="var(--accent-dark)" />
                  {number}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowCallOptions(false)}
              style={{ border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {showEmailForm ? (
        <div
          onClick={() => setShowEmailForm(false)}
          style={{ position: "fixed", inset: 0, zIndex: 5200, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: "clamp(12px, 4vw, 20px)", overflowY: "auto" }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: "clamp(300px, 95vw, 520px)", background: "#fff", borderRadius: 18, padding: "clamp(16px, 5vw, 22px)", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", display: "grid", gap: 14, margin: "auto" }}>
            <div>
              <p style={{ margin: 0, color: "var(--accent-dark)", fontWeight: 800, fontSize: "clamp(12px, 3vw, 14px)" }}>Email</p>
              <h3 style={{ margin: "6px 0 0", fontSize: "clamp(18px, 5vw, 22px)", fontFamily: "var(--font-display)", color: "#111827", lineHeight: 1.2 }}>Send an enquiry to {contactPersonName}</h3>
            </div>

            {contactPersonImage ? (
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 3vw, 12px)", padding: "clamp(8px, 2vw, 12px)", borderRadius: 14, background: "#f9fafb", flexWrap: "wrap" }}>
                <div
                  style={{
                    width: "clamp(60px, 15vw, 72px)",
                    height: "clamp(75px, 18vw, 92px)",
                    borderRadius: 12,
                    backgroundImage: `url('${contactPersonImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                    flex: "0 0 auto",
                  }}
                />
                <div style={{ display: "grid", gap: 2, minWidth: 0 }}>
                  <div style={{ color: "#111827", fontWeight: 700, fontSize: "clamp(13px, 3vw, 14px)", wordBreak: "break-word" }}>{contactPersonName}</div>
                  <div style={{ color: "#6b7280", fontSize: "clamp(11px, 2.5vw, 13px)", wordBreak: "break-all" }}>{email}</div>
                </div>
              </div>
            ) : null}

            <p style={{ margin: 0, color: "#6b7280", fontSize: "clamp(12px, 3vw, 13px)" }}>
              This message will be sent to {email}
            </p>

            <form onSubmit={submitEmailForm} style={{ display: "grid", gap: 12 }}>
              <div className="email-form-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 600, color: "#4b5563" }}>Your name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)", fontSize: "clamp(13px, 3vw, 14px)", fontFamily: "inherit" }} />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 600, color: "#4b5563" }}>Your email</span>
                  <input type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)", fontSize: "clamp(13px, 3vw, 14px)", fontFamily: "inherit" }} />
                </label>
              </div>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 600, color: "#4b5563" }}>Phone</span>
                <input
                  type="tel"
                  inputMode="tel"
                  pattern="^[1-9]\d{7,14}$"
                  title="Digits only, start with country code (e.g. 255772818324)"
                  placeholder="255772818324"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)", fontSize: "clamp(13px, 3vw, 14px)", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 600, color: "#4b5563" }}>Message</span>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px)", fontSize: "clamp(13px, 3vw, 14px)", resize: "vertical", fontFamily: "inherit", minHeight: "clamp(120px, 30vw, 150px)" }} />
              </label>

              <p style={{ margin: 0, minHeight: 18, fontSize: "clamp(12px, 3vw, 13px)", color: status.includes("sent") ? "#166534" : "#b42318" }}>{status}</p>

              <div className="email-form-buttons" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(8px, 2vw, 10px)", justifyItems: "stretch" }}>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  style={{ border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 12, padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)", fontWeight: 700, cursor: "pointer", fontSize: "clamp(12px, 3vw, 13px)", whiteSpace: "nowrap" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  style={{ border: "none", background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)", color: "#fff", borderRadius: 12, padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)", fontWeight: 700, cursor: busy ? "wait" : "pointer", fontSize: "clamp(12px, 3vw, 13px)", whiteSpace: "nowrap" }}
                >
                  {busy ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        /* Ensure proper responsive form layout */
        @media (min-width: 480px) {
          .email-form-row {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 479px) {
          .email-form-row {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
        }

        @media (min-width: 360px) {
          .email-form-buttons {
            display: grid !important;
            grid-template-columns: auto auto !important;
            justify-content: flex-end !important;
          }
        }

        @media (max-width: 359px) {
          .email-form-buttons {
            display: grid !important;
            grid-template-columns: 1fr !important;
            justify-items: stretch !important;
          }

          .email-form-buttons button {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}