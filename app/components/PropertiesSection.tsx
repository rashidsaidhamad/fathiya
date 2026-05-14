"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
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
      <div style={{ textAlign: "center", marginBottom: "clamp(30px, 6vw, 50px)" }}>
        <p
          style={{
            color: "#c49a6c",
            fontSize: "clamp(9px, 2vw, 11px)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {content.homePage.propertiesBadge}
        </p>
        <h2
          style={{
            fontSize: "clamp(24px, 6vw, 36px)",
            fontFamily: "Georgia, serif",
            color: "#222",
            marginBottom: "12px",
          }}
        >
          {content.homePage.propertiesTitle}
        </h2>
        <p style={{ color: "#888", fontSize: "clamp(12px, 2.5vw, 14px)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          {content.homePage.propertiesDescription}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px", width: "100%" }}>
        <button
          type="button"
          onClick={showPreviousProperties}
          disabled={properties.length <= visiblePropertyCount}
          aria-label="Show previous properties"
          style={{
            width: "clamp(36px, 8vw, 44px)",
            height: "clamp(36px, 8vw, 44px)",
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
            fontSize: "clamp(16px, 4vw, 20px)",
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
            width: "clamp(36px, 8vw, 44px)",
            height: "clamp(36px, 8vw, 44px)",
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
            fontSize: "clamp(16px, 4vw, 20px)",
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
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${idx * 0.1}s, transform 0.7s ease ${idx * 0.1}s, box-shadow 0.3s`,
                flex: properties.length <= 1 ? "1 1 380px" : "1 1 clamp(280px, 100%, 320px)",
                maxWidth: properties.length <= 1 ? "380px" : `calc((100% - ${22 * (visiblePropertyCount - 1)}px) / ${visiblePropertyCount})`,
                minHeight: "420px",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ position: "relative", height: "220px" }}>
                <div style={{ width: "100%", height: "100%", backgroundImage: `url('${primaryImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                {/* Best Deal badge removed */}
                <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 6, alignItems: "center" }}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); openPropertyVideo(p.videoUrl ?? "", p.title); }} style={{ padding: "5px 10px", borderRadius: "999px", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#c49a6c", textDecoration: "none", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" }}>
                    Watch Video
                  </button>
                </div>
              </div>
              <div style={{ padding: "clamp(12px, 3vw, 16px)", display: "flex", flexDirection: "column", flex: 1 }}>
                <p style={{ color: "#c49a6c", fontSize: "clamp(13px, 3vw, 15px)", fontWeight: 700, marginBottom: "4px" }}>{p.price}</p>
                <h3 style={{ fontSize: "clamp(13px, 3vw, 15px)", fontWeight: 700, color: "#222", marginBottom: "8px", lineHeight: 1.35 }}>{p.title}</h3>
                <div style={{ display: "flex", gap: "12px", color: "#333", fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 600, marginBottom: "12px", flexWrap: "wrap" }}>
                  <span>Bed: {p.beds}</span>
                  <span>Bath: {p.baths}</span>
                  <span>Size: {p.size.toLocaleString()} m<sup>2</sup></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: "13px", marginBottom: 12 }}>
                  <FaMapMarkerAlt color="#c49a6c" size={13} />
                  <span style={{ lineHeight: 1.5 }}>{p.location}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/properties/${p.id}`);
                  }}
                  style={{
                    marginTop: "auto",
                    border: "none",
                    borderRadius: "999px",
                    padding: "10px 16px",
                    background: "#c49a6c",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    alignSelf: "flex-start",
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
      <div style={{ display: "flex", justifyContent: "center", margin: "clamp(20px, 4vw, 28px) 0 0" }}>
        <a
          href="/properties"
          style={{
            backgroundColor: "#c49a6c",
            color: "#fff",
            padding: "clamp(10px, 2vw, 12px) clamp(24px, 6vw, 36px)",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "clamp(12px, 2.5vw, 14px)",
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
              {selectedEmailProperty!.title}
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
                <h3 style={{ margin: 0, color: "#111827", fontSize: "22px", fontFamily: "Georgia, serif" }}>{selectedGalleryProperty!.title}</h3>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>{selectedGalleryProperty!.location}</p>
              </div>
              <button type="button" onClick={closeGalleryModal} style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>

            {(() => {
              const gallerySource = selectedGalleryProperty!;
              const galleryImages = Array.isArray(gallerySource.images) && gallerySource.images.length > 0 ? gallerySource.images : [gallerySource.image];
              const currentGalleryImage = galleryImages[galleryImageIndex] ?? galleryImages[0] ?? gallerySource.image;
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
                        key={`${gallerySource.id}-${index}`}
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
                    <button type="button" onClick={() => openPropertyVideo(gallerySource.videoUrl ?? "", gallerySource.title)} style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}>
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
