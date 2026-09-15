"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { useInView } from "../hooks/useInView";
import { useSiteContent } from "../hooks/useSiteContent";
import { toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

const CALL_NUMBERS = ["+255659740712", "+255659741770"];

export default function PropertiesSection() {
  const { ref, inView } = useInView();
  const router = useRouter();
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

    if (leadPhone && !/^[1-9]\d{7,14}$/.test(leadPhone.trim())) {
      setLeadFormStatus("Please enter a valid phone number starting with country code (digits only, e.g. 255772818324).");
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
        padding: "100px clamp(18px, 6vw, 80px)",
        backgroundColor: "var(--background)",
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(196,154,108,0.08) 0%, transparent 50%)",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "clamp(30px, 6vw, 56px)" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 16px",
            borderRadius: "var(--radius-pill)",
            backgroundColor: "var(--accent-soft)",
            color: "var(--accent-dark)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          {content.homePage.propertiesBadge}
        </div>
        <h2
          style={{
            fontSize: "clamp(24px, 6vw, 40px)",
            fontFamily: "var(--font-display)",
            color: "var(--ink)",
            fontWeight: 700,
            marginBottom: "14px",
            letterSpacing: "-0.01em",
          }}
        >
          {content.homePage.propertiesTitle}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "clamp(12px, 2.5vw, 15px)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
          {content.homePage.propertiesDescription}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "20px", width: "100%" }}>
        <button
          type="button"
          onClick={showPreviousProperties}
          disabled={properties.length <= visiblePropertyCount}
          aria-label="Show previous properties"
          style={{
            width: "clamp(38px, 8vw, 46px)",
            height: "clamp(38px, 8vw, 46px)",
            borderRadius: "50%",
            border: "none",
            backgroundColor: properties.length <= visiblePropertyCount ? "var(--surface)" : "#fff",
            color: properties.length <= visiblePropertyCount ? "#ccc" : "var(--accent-dark)",
            cursor: properties.length <= visiblePropertyCount ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            fontSize: "clamp(16px, 4vw, 22px)",
            transition: "transform 0.25s",
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
            width: "clamp(38px, 8vw, 46px)",
            height: "clamp(38px, 8vw, 46px)",
            borderRadius: "50%",
            border: "none",
            backgroundColor: properties.length <= visiblePropertyCount ? "var(--surface)" : "#fff",
            color: properties.length <= visiblePropertyCount ? "#ccc" : "var(--accent-dark)",
            cursor: properties.length <= visiblePropertyCount ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            fontSize: "clamp(16px, 4vw, 22px)",
            transition: "transform 0.25s",
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
          gap: "26px",
          alignItems: "flex-start",
          justifyContent: properties.length <= 1 ? "center" : "stretch",
        }}
      >
        {visibleProperties.map((p, idx) => {
          const propertyImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image];
          const primaryImage = propertyImages[0] ?? p.image;

          return (
            <div
              key={p.id}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/properties/${p.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/properties/${p.id}`);
                }
              }}
              className="hover-lift"
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${idx * 0.1}s, transform 0.7s ease ${idx * 0.1}s`,
                flex: properties.length <= 1 ? "1 1 380px" : "1 1 clamp(280px, 100%, 320px)",
                maxWidth: properties.length <= 1 ? "380px" : `calc((100% - ${26 * (visiblePropertyCount - 1)}px) / ${visiblePropertyCount})`,
                minHeight: "510px",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <div style={{ position: "relative", height: "230px" }}>
                <div style={{ width: "100%", height: "100%", backgroundImage: `url('${primaryImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(11,12,19,0.72) 100%)" }} />
                <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 6 }}>
                  <span style={{ backgroundColor: p.statusColor || "var(--accent)", color: "#fff", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                    {p.status}
                  </span>
                  <span style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#2f9e5b", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                    {p.active}
                  </span>
                </div>
                <p style={{ position: "absolute", left: 16, bottom: 44, margin: 0, color: "#fff", fontSize: "20px", fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
                  {p.price}
                </p>
                <div style={{ position: "absolute", bottom: 12, left: 16, display: "flex", gap: 6, alignItems: "center" }}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); openPropertyVideo(p.videoUrl ?? "", p.title); }} style={{ padding: "6px 12px", borderRadius: "var(--radius-pill)", border: "none", background: "rgba(255,255,255,0.92)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-dark)", textDecoration: "none", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "var(--shadow-sm)" }}>
                    Watch Video
                  </button>
                </div>
              </div>
              <div style={{ padding: "clamp(14px, 3vw, 20px)", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <p style={{ margin: 0, fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, color: "var(--ink)", lineHeight: 1.35 }}>{p.title}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-soft)", fontSize: "13px" }}>
                  <FaMapMarkerAlt color="var(--accent-dark)" size={13} />
                  <span style={{ lineHeight: 1.5 }}>{p.location}</span>
                </div>
                <div style={{ display: "flex", gap: "14px", color: "var(--ink-soft)", fontSize: "clamp(11px, 2vw, 12.5px)", fontWeight: 600, flexWrap: "wrap", paddingTop: 12, paddingBottom: 12, borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FaBed color="var(--accent-dark)" size={12} /> {p.beds} Beds</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FaBath color="var(--accent-dark)" size={12} /> {p.baths} Baths</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FaRulerCombined color="var(--accent-dark)" size={12} /> {p.size.toLocaleString("en-US")} m²</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCallModal();
                    }}
                    style={{ flex: 1, padding: "9px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "var(--ink-soft)", fontWeight: 600 }}
                  >
                    <FaPhone size={11} color="var(--accent-dark)" /> Call
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEmailModal(p.id);
                    }}
                    style={{ flex: 1, padding: "9px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "var(--ink-soft)", fontWeight: 600 }}
                  >
                    <FaEnvelope size={11} color="var(--accent-dark)" /> Email
                  </button>
                  <a
                    href={toWhatsAppHref(p.contactWhatsapp || "+255659740712", `Hello, I'm interested in ${p.title}`)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                  >
                    <FaWhatsapp size={14} color="#25D366" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/properties/${p.id}`);
                  }}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    border: "none",
                    borderRadius: "var(--radius-pill)",
                    padding: "11px 18px",
                    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 8px 18px rgba(196,154,108,0.3)",
                  }}
                >
                  Show More
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button */}
      <div style={{ display: "flex", justifyContent: "center", margin: "clamp(24px, 4vw, 36px) 0 0" }}>
        <a
          href="/properties"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
            color: "#fff",
            padding: "clamp(12px, 2vw, 14px) clamp(28px, 6vw, 38px)",
            borderRadius: "var(--radius-pill)",
            textDecoration: "none",
            fontSize: "clamp(12px, 2.5vw, 14.5px)",
            fontWeight: 700,
            transition: "transform 0.25s",
            display: "inline-block",
            boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
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
            backgroundColor: "rgba(10,12,20,0.55)",
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
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              padding: "24px",
              display: "grid",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0, color: "var(--ink)", fontSize: "20px", fontFamily: "var(--font-display)" }}>Call Archipelago</h3>
            <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "13px" }}>Choose a number to call:</p>
            {CALL_NUMBERS.map((phone) => (
              <a
                key={phone}
                href={toTelHref(phone)}
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--ink)",
                  borderRadius: "var(--radius-sm)",
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
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "var(--radius-sm)", padding: "9px 14px", fontWeight: 600, cursor: "pointer" }}
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
            backgroundColor: "rgba(10,12,20,0.55)",
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
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              padding: "26px",
              display: "grid",
              gap: "12px",
            }}
          >
            <h3 style={{ margin: 0, color: "var(--ink)", fontSize: "22px", fontFamily: "var(--font-display)" }}>Property Enquiry</h3>
            <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "13px" }}>
              {selectedEmailProperty!.title}
            </p>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "12px" }}>
              This message will be sent to archipelagoproperties.zanzibar@gmail.com
            </p>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>Full Name</span>
              <input
                value={leadFullName}
                onChange={(event) => setLeadFullName(event.target.value)}
                placeholder="Enter full name"
                style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: "13px", fontFamily: "var(--font-sans)" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>Email Address</span>
              <input
                type="email"
                value={leadEmail}
                onChange={(event) => setLeadEmail(event.target.value)}
                placeholder="Enter email address"
                style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: "13px", fontFamily: "var(--font-sans)" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>Phone Number</span>
              <input
                value={leadPhone}
                onChange={(event) => setLeadPhone(event.target.value)}
                placeholder="Enter phone number"
                style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: "13px", fontFamily: "var(--font-sans)" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>Message</span>
              <textarea
                value={leadMessage}
                onChange={(event) => setLeadMessage(event.target.value)}
                placeholder="Write your message"
                rows={4}
                style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: "13px", fontFamily: "var(--font-sans)", resize: "vertical" }}
              />
            </label>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
              <button
                type="button"
                onClick={closeEmailModal}
                disabled={leadFormBusy}
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "var(--radius-sm)", padding: "10px 16px", fontWeight: 600, cursor: leadFormBusy ? "default" : "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitPropertyLead}
                disabled={leadFormBusy}
                style={{ border: "none", background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)", color: "#fff", borderRadius: "var(--radius-sm)", padding: "10px 16px", fontWeight: 700, cursor: leadFormBusy ? "default" : "pointer" }}
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
            backgroundColor: "rgba(10,12,20,0.55)",
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
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              padding: "20px",
              display: "grid",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <h3 style={{ margin: 0, color: "var(--ink)", fontSize: "22px", fontFamily: "var(--font-display)" }}>{selectedGalleryProperty!.title}</h3>
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "13px" }}>{selectedGalleryProperty!.location}</p>
              </div>
              <button type="button" onClick={closeGalleryModal} style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "var(--radius-sm)", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>

            {(() => {
              const gallerySource = selectedGalleryProperty!;
              const galleryImages = Array.isArray(gallerySource.images) && gallerySource.images.length > 0 ? gallerySource.images : [gallerySource.image];
              const currentGalleryImage = galleryImages[galleryImageIndex] ?? galleryImages[0] ?? gallerySource.image;
              return (
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ position: "relative", height: "420px", borderRadius: "var(--radius-sm)", overflow: "hidden", backgroundColor: "var(--background)" }}>
                    <div style={{ width: "100%", height: "100%", backgroundImage: `url('${currentGalleryImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    <button type="button" onClick={() => setGalleryImageIndex((index) => Math.max(0, index - 1))} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer" }}>‹</button>
                    <button type="button" onClick={() => setGalleryImageIndex((index) => Math.min(galleryImages.length - 1, index + 1))} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer" }}>›</button>
                  </div>

                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {galleryImages.map((imageUrl, index) => (
                      <button
                        key={`${gallerySource.id}-${index}`}
                        type="button"
                        onClick={() => setGalleryImageIndex(index)}
                        style={{
                          flex: "0 0 auto",
                          width: "88px",
                          height: "64px",
                          borderRadius: "var(--radius-sm)",
                          border: galleryImageIndex === index ? "2px solid var(--accent)" : "1px solid var(--border)",
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
                    <button type="button" onClick={() => openPropertyVideo(gallerySource.videoUrl ?? "", gallerySource.title)} style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "var(--radius-sm)", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
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
