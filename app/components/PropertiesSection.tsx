"use client";
import { useMemo, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useSiteContent } from "../hooks/useSiteContent";
import { toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

const CALL_NUMBERS = ["+255659740712", "+255659741770"];

export default function PropertiesSection() {
  const { ref, inView } = useInView();
  const content = useSiteContent();
  const properties = content.properties;
  const [emailModalPropertyId, setEmailModalPropertyId] = useState<number | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [leadFullName, setLeadFullName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadFormBusy, setLeadFormBusy] = useState(false);
  const [leadFormStatus, setLeadFormStatus] = useState("");

  const selectedEmailProperty = useMemo(
    () => properties.find((property) => property.id === emailModalPropertyId) ?? null,
    [properties, emailModalPropertyId],
  );

  function openEmailModal(propertyId: number) {
    setEmailModalPropertyId(propertyId);
    setLeadFullName("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadMessage("");
    setLeadFormStatus("");
  }

  function closeEmailModal() {
    if (leadFormBusy) return;
    setEmailModalPropertyId(null);
    setLeadFormStatus("");
  }

  function openCallModal() {
    setCallModalOpen(true);
  }

  function closeCallModal() {
    setCallModalOpen(false);
  }

  async function submitPropertyLead() {
    if (!selectedEmailProperty) return;

    const emailValue = leadEmail.trim();
    const emailLooksValid = /^\S+@\S+\.\S+$/.test(emailValue);

    if (!leadFullName.trim() || !leadPhone.trim() || !emailValue || !leadMessage.trim()) {
      setLeadFormStatus("Please enter full name, email, phone number, and message.");
      return;
    }

    if (!emailLooksValid) {
      setLeadFormStatus("Please enter a valid email address.");
      return;
    }

    setLeadFormBusy(true);
    setLeadFormStatus("Sending...");

    try {
      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "home",
          name: leadFullName.trim(),
          email: emailValue,
          phone: leadPhone.trim(),
          message: `Property enquiry for: ${selectedEmailProperty.title} (${selectedEmailProperty.location})\n\n${leadMessage.trim()}`,
          hearAboutUs: [],
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            error?: string;
            emailRouting?: {
              sent?: boolean;
            };
          }
        | null;
      if (!response.ok) {
        setLeadFormStatus(payload?.error ?? "Could not send enquiry.");
        setLeadFormBusy(false);
        return;
      }

      if (payload?.emailRouting?.sent) {
        setLeadFormStatus("Email sent successfully.");
      } else {
        setLeadFormStatus("Enquiry saved, but SMTP is not configured yet.");
      }
      setLeadFormBusy(false);
      setTimeout(() => {
        setEmailModalPropertyId(null);
        setLeadFormStatus("");
      }, 900);
    } catch {
      setLeadFormStatus("Could not send enquiry.");
      setLeadFormBusy(false);
    }
  }

  return (
    <section
      className="properties-root"
      ref={ref}
      style={{
        padding: "80px clamp(18px, 6vw, 80px)",
        backgroundColor: "#faf8f5",
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(196,154,108,0.05) 0%, transparent 50%)",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <p
          style={{
            color: "#c49a6c",
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {content.homePage.propertiesBadge}
        </p>
        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Georgia, serif",
            color: "#222",
            marginBottom: "12px",
          }}
        >
          {content.homePage.propertiesTitle}
        </h2>
        <p style={{ color: "#888", fontSize: "14px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          {content.homePage.propertiesDescription}
        </p>
      </div>

      <div
        className="properties-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "22px",
          alignItems: "stretch",
        }}
      >
        {properties.map((p, idx) => {
          const propertyImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image];
          const primaryImage = propertyImages[0] ?? p.image;

          return (
            <div
              key={p.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${idx * 0.1}s, transform 0.7s ease ${idx * 0.1}s, box-shadow 0.3s`,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
            >
                {/* Image */}
                <div style={{ position: "relative", height: "200px" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url('${primaryImage}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* Tags - top right */}
                  <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "6px" }}>
                    <span
                      style={{
                        backgroundColor: p.statusColor,
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {p.status}
                    </span>
                    <span
                      style={{
                        backgroundColor: p.statusColor,
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {p.active}
                    </span>
                  </div>
                  {/* Action icons - bottom left */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    {[
                      <svg key="share" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
                      <svg key="heart" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
                      <span key="plus" style={{ fontSize: "16px", color: "#555", lineHeight: 1 }}>+</span>,
                    ].map((icon, i) => (
                      <button
                        key={i}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.92)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", height: "100%" }}>
                  <p style={{ color: "#c49a6c", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                    {p.price}
                  </p>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#222",
                      marginBottom: "8px",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ color: "#555", fontSize: "13px", marginBottom: "14px", lineHeight: 1.6 }}>
                    {p.description}
                  </p>
                  <p style={{ color: "#666", fontSize: "12px", marginBottom: "12px" }}>
                    Location: {p.location}
                    {p.mapUrl ? (
                      <>
                        {" "}
                        <a href={p.mapUrl} target="_blank" rel="noreferrer" style={{ color: "#c49a6c", textDecoration: "none", fontWeight: 600 }}>
                          View Map
                        </a>
                      </>
                    ) : null}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "13px",
                      color: "#333",
                      fontWeight: 500,
                      marginBottom: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>Beds: {p.beds}</span>
                    <span>Baths: {p.baths}</span>
                    <span>
                      Size: {p.size} m<sup>2</sup>
                    </span>
                    <span>Year Built: {p.year}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                    <button type="button" onClick={openCallModal} style={{ flex: 1, padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fff", fontSize: "12px", cursor: "pointer", color: "#555", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12 19.79 19.79 0 011.5 3.18 2 2 0 013.5 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                      Call
                    </button>
                    <button type="button" onClick={() => openEmailModal(p.id)} style={{ flex: 1, padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fff", fontSize: "12px", cursor: "pointer", color: "#555", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </button>
                    <a href={toWhatsAppHref(p.contactWhatsapp, content.contactActions.whatsappMessage)} target="_blank" rel="noreferrer" style={{ padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fff", fontSize: "16px", cursor: "pointer", color: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
          );
        })}
      </div>

      {/* View More Button */}
      <div style={{ display: "flex", justifyContent: "center", margin: "28px 0 0" }}>
        <a
          href="/properties"
          style={{
            backgroundColor: "#c49a6c",
            color: "#fff",
            padding: "12px 36px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
            transition: "background-color 0.3s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a07850")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#c49a6c")}
        >
          View More Properties
        </a>
      </div>

      {callModalOpen ? (
        <div
          onClick={closeCallModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 3000,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "360px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 24px 50px rgba(0,0,0,0.25)",
              padding: "20px",
              display: "grid",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0, color: "#111827", fontSize: "20px", fontFamily: "Georgia, serif" }}>Call Archipelago</h3>
            <p style={{ margin: 0, color: "#4b5563", fontSize: "13px" }}>Choose a number to call:</p>
            {CALL_NUMBERS.map((phone) => (
              <a
                key={phone}
                href={toTelHref(phone)}
                style={{
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  color: "#374151",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12 19.79 19.79 0 011.5 3.18 2 2 0 013.5 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                {phone}
              </a>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
              <button
                type="button"
                onClick={closeCallModal}
                style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "9px 14px", fontWeight: 600, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedEmailProperty ? (
        <div
          onClick={closeEmailModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 3000,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 24px 50px rgba(0,0,0,0.25)",
              padding: "22px",
              display: "grid",
              gap: "12px",
            }}
          >
            <h3 style={{ margin: 0, color: "#111827", fontSize: "22px", fontFamily: "Georgia, serif" }}>Property Enquiry</h3>
            <p style={{ margin: 0, color: "#4b5563", fontSize: "13px" }}>
              {selectedEmailProperty.title}
            </p>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>
              This message will be sent to archipelagoproperties.zanzibar@gmail.com
            </p>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>Full Name</span>
              <input
                value={leadFullName}
                onChange={(event) => setLeadFullName(event.target.value)}
                placeholder="Enter full name"
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>Email Address</span>
              <input
                type="email"
                value={leadEmail}
                onChange={(event) => setLeadEmail(event.target.value)}
                placeholder="Enter email address"
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>Phone Number</span>
              <input
                value={leadPhone}
                onChange={(event) => setLeadPhone(event.target.value)}
                placeholder="Enter phone number"
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>Message</span>
              <textarea
                value={leadMessage}
                onChange={(event) => setLeadMessage(event.target.value)}
                placeholder="Write your message"
                rows={4}
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
              />
            </label>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
              <button
                type="button"
                onClick={closeEmailModal}
                disabled={leadFormBusy}
                style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "10px 14px", fontWeight: 600, cursor: leadFormBusy ? "default" : "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitPropertyLead}
                disabled={leadFormBusy}
                style={{ border: "none", backgroundColor: "#c49a6c", color: "#fff", borderRadius: "8px", padding: "10px 14px", fontWeight: 700, cursor: leadFormBusy ? "default" : "pointer" }}
              >
                {leadFormBusy ? "Sending..." : "Send Email"}
              </button>
            </div>
            <p style={{ margin: 0, minHeight: "18px", fontSize: "12px", color: leadFormStatus.includes("sent") ? "#166534" : "#7f1d1d" }}>
              {leadFormStatus}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
