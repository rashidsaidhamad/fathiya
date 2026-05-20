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
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#c49a6c" }}><FaPhone /></span>
          <span>Call Agent</span>
        </button>

        <button
          type="button"
          onClick={() => setShowEmailForm(true)}
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#111827", background: "#f9fafb", borderRadius: 14, padding: 14, border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#c49a6c" }}><FaEnvelope /></span>
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
              <p style={{ margin: 0, color: "#c49a6c", fontWeight: 800 }}>Call</p>
              <h3 style={{ margin: "6px 0 0", fontSize: 22, fontFamily: "Georgia, serif", color: "#111827" }}>Choose a number</h3>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {phoneNumbers.map((number) => (
                <a
                  key={number}
                  href={toTelHref(number)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, background: "#f9fafb", color: "#111827", textDecoration: "none", fontWeight: 700 }}
                >
                  <FaPhone color="#c49a6c" />
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
          style={{ position: "fixed", inset: 0, zIndex: 5200, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 20 }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 520, background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.25)", display: "grid", gap: 14 }}>
            <div>
              <p style={{ margin: 0, color: "#c49a6c", fontWeight: 800 }}>Email</p>
              <h3 style={{ margin: "6px 0 0", fontSize: 22, fontFamily: "Georgia, serif", color: "#111827" }}>Send an enquiry to {contactPersonName}</h3>
            </div>

            {contactPersonImage ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, background: "#f9fafb" }}>
                <div
                  style={{
                    width: 72,
                    height: 92,
                    borderRadius: 12,
                    backgroundImage: `url('${contactPersonImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                    flex: "0 0 auto",
                  }}
                />
                <div style={{ display: "grid", gap: 2 }}>
                  <div style={{ color: "#111827", fontWeight: 700 }}>{contactPersonName}</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>{email}</div>
                </div>
              </div>
            ) : null}

            <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
              This message will be sent to {email}
            </p>

            <form onSubmit={submitEmailForm} style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>Your name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 14 }} />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>Your email</span>
                  <input type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 14 }} />
                </label>
              </div>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>Phone</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 14 }} />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>Message</span>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 14, resize: "vertical" }} />
              </label>

              <p style={{ margin: 0, minHeight: 18, fontSize: 13, color: status.includes("sent") ? "#166534" : "#b42318" }}>{status}</p>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  style={{ border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  style={{ border: "none", background: "#c49a6c", color: "#fff", borderRadius: 12, padding: "10px 16px", fontWeight: 700, cursor: busy ? "wait" : "pointer" }}
                >
                  {busy ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .property-contact-modal .form-input,
        .property-contact-modal textarea {
          width: 100%;
        }

        @media (max-width: 720px) {
          .property-contact-modal > div[onClick] {
            padding: 12px !important;
          }

          .property-contact-modal form {
            gap: 10px !important;
          }

          .property-contact-modal input,
          .property-contact-modal textarea {
            font-size: 14px !important;
            padding: 10px !important;
          }
        }
      `}</style>
    </>
  );
}