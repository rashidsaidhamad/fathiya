"use client";
import { useMemo, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useSiteContent } from "../hooks/useSiteContent";
import { toTelHref, toWhatsAppHref } from "../../lib/contactLinks";
import ExpandableDescription from "./ExpandableDescription";

const CALL_NUMBERS = ["+255659740712", "+255659741770"];

export default function PropertiesSection() {
  const { ref, inView } = useInView();
  const content = useSiteContent();
  const properties = content.properties;
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [emailModalPropertyId, setEmailModalPropertyId] = useState<number | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [galleryModalPropertyId, setGalleryModalPropertyId] = useState<number | null>(null);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
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

  const selectedGalleryProperty = useMemo(
    () => properties.find((property) => property.id === galleryModalPropertyId) ?? null,
    [properties, galleryModalPropertyId],
  );

  const visiblePropertyCount = Math.min(3, properties.length);
  const visibleProperties = useMemo(() => {
    if (properties.length <= visiblePropertyCount) {
      return properties;
    }

    return Array.from({ length: visiblePropertyCount }, (_, index) => properties[(visibleStartIndex + index) % properties.length]);
  }, [properties, visiblePropertyCount, visibleStartIndex]);

  function showPreviousProperties() {
    if (properties.length <= visiblePropertyCount) return;
    setVisibleStartIndex((current) => (current === 0 ? properties.length - visiblePropertyCount : current - 1));
  }

  function showNextProperties() {
    if (properties.length <= visiblePropertyCount) return;
    setVisibleStartIndex((current) => (current >= properties.length - visiblePropertyCount ? 0 : current + 1));
  }

  function openPropertyVideo(videoUrl: string, title: string) {
    if (videoUrl.trim()) {
      window.open(videoUrl, "_blank", "noreferrer");
      return;
    }

    window.alert(`No video available for ${title}.`);
  }

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

  function openGalleryModal(propertyId: number) {
    setGalleryModalPropertyId(propertyId);
    setGalleryImageIndex(0);
  }

  function closeGalleryModal() {
    setGalleryModalPropertyId(null);
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
        <button
          type="button"
          onClick={showPreviousProperties}
          disabled={properties.length <= visiblePropertyCount}
          aria-label="Show previous properties"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid #e0d4c2",
            backgroundColor: "#fff",
            color: "#7c5a37",
            cursor: properties.length <= visiblePropertyCount ? "default" : "pointer",
            opacity: properties.length <= visiblePropertyCount ? 0.45 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={showNextProperties}
          disabled={properties.length <= visiblePropertyCount}
          aria-label="Show next properties"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid #e0d4c2",
            backgroundColor: "#fff",
            color: "#7c5a37",
            cursor: properties.length <= visiblePropertyCount ? "default" : "pointer",
            opacity: properties.length <= visiblePropertyCount ? 0.45 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          ›
        </button>
      </div>

      <div
        className="properties-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "22px",
          alignItems: "flex-start",
          justifyContent: properties.length <= 1 ? "center" : "stretch",
        }}
      >
        {visibleProperties.map((p, idx) => {
          const propertyImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image];
          const primaryImage = propertyImages[0] ?? p.image;
          const videoHref = p.videoUrl?.trim() || content.videoSection.videoUrl?.trim() || "";

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
                flex: properties.length <= 1 ? "1 1 380px" : "1 1 260px",
                maxWidth: properties.length <= 1 ? "380px" : `calc((100% - ${22 * (visiblePropertyCount - 1)}px) / ${visiblePropertyCount})`,
                minHeight: "560px",
                display: "flex",
                flexDirection: "column",
              }}
                onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
            >
                {/* Image */}
                <div style={{ position: "relative", height: "230px" }}>
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
                  {/* Bottom action icons */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href={p.mapUrl}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noreferrer"
                      title={`Open map for ${p.title}`}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.9)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#c49a6c",
                        textDecoration: "none",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGalleryModal(p.id);
                      }}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "999px",
                        border: "none",
                        background: "rgba(255,255,255,0.9)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#c49a6c",
                        fontSize: "11px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Gallery
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPropertyVideo(p.videoUrl ?? "", p.title);
                      }}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "999px",
                        border: "none",
                        background: "rgba(255,255,255,0.9)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#c49a6c",
                        textDecoration: "none",
                        fontSize: "11px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Watch Video
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ color: "#c49a6c", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                    {p.price}
                  </p>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#222",
                      marginBottom: "8px",
                    }}
                  >
                    {p.title}
                  </h3>
                  <ExpandableDescription
                    description={p.description}
                    maxLength={150}
                    color="#777"
                    fontSize="13px"
                    marginBottom="12px"
                    lineHeight={1.8}
                  />
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
                      gap: "14px",
                      color: "#333",
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "10px",
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
                    <button type="button" onClick={(e) => { e.stopPropagation(); openCallModal(); }} style={{ flex: 1, padding: "8px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "#555" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12 19.79 19.79 0 011.5 3.18 2 2 0 013.5 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                      Call
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); openEmailModal(p.id); }} style={{ flex: 1, padding: "8px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "#555" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </button>
                    <a href={toWhatsAppHref(p.contactWhatsapp, content.contactActions.whatsappMessage)} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" style={{ padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
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
      {selectedGalleryProperty ? (
        <div
          onClick={closeGalleryModal}
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
              maxWidth: "860px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 24px 50px rgba(0,0,0,0.25)",
              padding: "18px",
              display: "grid",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#111827", fontSize: "22px", fontFamily: "Georgia, serif" }}>{selectedGalleryProperty.title}</h3>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>{selectedGalleryProperty.location}</p>
              </div>
              <button type="button" onClick={closeGalleryModal} style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>

            {(() => {
              const galleryImages = Array.isArray(selectedGalleryProperty.images) && selectedGalleryProperty.images.length > 0 ? selectedGalleryProperty.images : [selectedGalleryProperty.image];
              const currentGalleryImage = galleryImages[galleryImageIndex] ?? galleryImages[0] ?? selectedGalleryProperty.image;
              return (
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ position: "relative", height: "420px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#f3f4f6" }}>
                    <div style={{ width: "100%", height: "100%", backgroundImage: `url('${currentGalleryImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    <button type="button" onClick={() => setGalleryImageIndex((index) => Math.max(0, index - 1))} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.85)", cursor: "pointer" }}>‹</button>
                    <button type="button" onClick={() => setGalleryImageIndex((index) => Math.min(galleryImages.length - 1, index + 1))} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.85)", cursor: "pointer" }}>›</button>
                  </div>

                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {galleryImages.map((imageUrl, index) => (
                      <button
                        key={`${selectedGalleryProperty.id}-${index}`}
                        type="button"
                        onClick={() => setGalleryImageIndex(index)}
                        style={{
                          flex: "0 0 auto",
                          width: "88px",
                          height: "64px",
                          borderRadius: "8px",
                          border: galleryImageIndex === index ? "2px solid #c49a6c" : "1px solid #e5e7eb",
                          backgroundImage: `url('${imageUrl}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                        }}
                        aria-label={`Show gallery image ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => openPropertyVideo(selectedGalleryProperty.videoUrl ?? "", selectedGalleryProperty.title)} style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}>
                      Watch Video
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : null}
    </section>
  );
}
