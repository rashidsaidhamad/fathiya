"use client";
import { useEffect, useMemo, useState } from "react";
import { FaPhone, FaEnvelope, FaWhatsapp, FaThLarge, FaList, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSiteContent } from "../hooks/useSiteContent";
import { toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

const CALL_NUMBERS = ["+255659740712", "+255659741770"];

const ALL_CATEGORIES = "All Categories";
const ALL_CITIES = "All Cities";

type SortOption = "Price High to Low" | "Price Low to High" | "Newest" | "Oldest";

function parseLocationParts(location: string) {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    city: parts[0] ?? "Unknown City",
  };
}

function parsePrice(price: string) {
  const numeric = Number(price.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function inferPropertyType(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("villa")) return "Villa";
  if (text.includes("apartment") || text.includes("flat")) return "Apartment";
  if (text.includes("land") || text.includes("plot")) return "Land";
  if (text.includes("house") || text.includes("home")) return "House";
  return "Property";
}

export default function PropertiesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [propertyImageIndexes, setPropertyImageIndexes] = useState<Record<number, number>>({});
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
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [cityFilter, setCityFilter] = useState(ALL_CITIES);
  const [sortBy, setSortBy] = useState<SortOption>("Price High to Low");
  const [requestedType, setRequestedType] = useState("");
  const [requestedActive, setRequestedActive] = useState("");
  const [requestedLocation, setRequestedLocation] = useState("");
  const content = useSiteContent();
  const properties = content.properties;

  const enhancedProperties = useMemo(
    () =>
      properties.map((property) => {
        const { city } = parseLocationParts(property.location);
        return {
          ...property,
          city,
          numericPrice: parsePrice(property.price),
        };
      }),
    [properties],
  );

  const categoryOptions = useMemo(
    () => [ALL_CATEGORIES, ...Array.from(new Set(enhancedProperties.map((p) => p.status))).sort()],
    [enhancedProperties],
  );
  const cityOptions = useMemo(
    () => [ALL_CITIES, ...Array.from(new Set(enhancedProperties.map((p) => p.city))).sort()],
    [enhancedProperties],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category");
    const nextRequestedLocation = params.get("location");
    const nextRequestedType = params.get("type");
    const nextRequestedActive = params.get("active");

    if (requestedCategory) {
      setCategoryFilter(requestedCategory);
    }

    if (nextRequestedLocation) {
      setCityFilter(nextRequestedLocation.split(",")[0]?.trim() || nextRequestedLocation);
    }

    setRequestedType(nextRequestedType?.trim() ?? "");
    setRequestedActive(nextRequestedActive?.trim() ?? "");
    setRequestedLocation(nextRequestedLocation?.trim() ?? "");
  }, []);

  const filteredProperties = useMemo(() => {
    const matches = enhancedProperties.filter((property) => {
      if (categoryFilter !== ALL_CATEGORIES && property.status !== categoryFilter) return false;
      if (cityFilter !== ALL_CITIES && property.city !== cityFilter) return false;
      if (requestedType.length > 0 && inferPropertyType(property.title, property.description) !== requestedType) return false;
      if (requestedActive.length > 0 && property.active !== requestedActive) return false;
      if (requestedLocation.length > 0 && !property.location.toLowerCase().includes(requestedLocation.toLowerCase())) return false;
      return true;
    });

    matches.sort((a, b) => {
      if (sortBy === "Price High to Low") return b.numericPrice - a.numericPrice;
      if (sortBy === "Price Low to High") return a.numericPrice - b.numericPrice;
      if (sortBy === "Newest") return b.year - a.year;
      return a.year - b.year;
    });

    return matches;
  }, [enhancedProperties, categoryFilter, cityFilter, requestedActive, requestedLocation, requestedType, sortBy]);

  const getMapUrl = (location: string, mapUrl?: string) =>
    mapUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(location)}`;

  const getPropertyImages = (images?: string[], image?: string) => {
    const gallery = (images ?? []).filter((item) => typeof item === "string" && item.trim().length > 0);
    if (gallery.length > 0) return gallery;
    return image ? [image] : [];
  };

  const openPropertyVideo = (videoUrl?: string, title?: string) => {
    const trimmedUrl = videoUrl?.trim();
    if (trimmedUrl) {
      window.open(trimmedUrl, "_blank", "noreferrer");
      return;
    }

    window.alert(`No video available for ${title || "this property"}.`);
  };

  const goToNextPropertyImage = (propertyId: number, totalImages: number) => {
    if (totalImages <= 1) return;
    setPropertyImageIndexes((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] ?? 0) + 1) % totalImages,
    }));
  };

  const goToPrevPropertyImage = (propertyId: number, totalImages: number) => {
    if (totalImages <= 1) return;
    setPropertyImageIndexes((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] ?? 0) - 1 + totalImages) % totalImages,
    }));
  };

  const selectedEmailProperty = useMemo(
    () => properties.find((property) => property.id === emailModalPropertyId) ?? null,
    [properties, emailModalPropertyId],
  );

  const selectedGalleryProperty = useMemo(
    () => properties.find((property) => property.id === galleryModalPropertyId) ?? null,
    [properties, galleryModalPropertyId],
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
          source: "contact",
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
    <>
      <Navbar forceWhite />
      <div style={{ paddingTop: "70px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Page content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(20px, 4vw, 32px) clamp(14px, 3vw, 24px)" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "clamp(11px, 2vw, 13px)", color: "#888", marginBottom: "16px" }}>
          <a href="/" style={{ color: "#333", textDecoration: "none" }}>Home</a>
          <span style={{ margin: "0 6px", color: "#aaa" }}>›</span>
          <span style={{ color: "#c49a6c", fontWeight: 600 }}>Properties</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 700, color: "#1a1a2e", marginBottom: "24px", fontFamily: "Georgia, serif" }}>
          Properties
        </h1>

        {/* Filter bar */}
        <div
          className="properties-page-filter-bar"
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            padding: "clamp(10px, 2vw, 12px) clamp(14px, 3vw, 20px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 1.5vw, 8px)",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "clamp(5px, 1vw, 6px) clamp(7px, 1.5vw, 10px)",
              fontSize: "clamp(11px, 2vw, 13px)",
              color: "#444",
              cursor: "pointer",
              background: "#fff",
              flex: "1 1 calc(50% - 4px)",
              minWidth: "120px",
            }}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "clamp(5px, 1vw, 6px) clamp(7px, 1.5vw, 10px)",
              fontSize: "clamp(11px, 2vw, 13px)",
              color: "#444",
              cursor: "pointer",
              background: "#fff",
              flex: "1 1 calc(50% - 4px)",
              minWidth: "120px",
            }}
          >
            {cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "clamp(5px, 1vw, 6px) clamp(7px, 1.5vw, 10px)",
              fontSize: "clamp(11px, 2vw, 13px)",
              color: "#444",
              cursor: "pointer",
              background: "#fff",
              flex: "1 1 calc(50% - 4px)",
              minWidth: "120px",
            }}
          >
            <option value="Price High to Low">Price High to Low</option>
            <option value="Price Low to High">Price Low to High</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
          {/* View toggle */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "clamp(4px, 1vw, 6px)", flex: "0 1 auto" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "clamp(5px, 1vw, 6px) clamp(7px, 1.5vw, 10px)",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: viewMode === "grid" ? "#c49a6c" : "#fff",
                color: viewMode === "grid" ? "#fff" : "#555",
                fontSize: "clamp(11px, 2vw, 13px)",
              }}
            >
              <FaThLarge size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "clamp(5px, 1vw, 6px) clamp(7px, 1.5vw, 10px)",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: viewMode === "list" ? "#c49a6c" : "#fff",
                color: viewMode === "list" ? "#fff" : "#555",
                fontSize: "clamp(11px, 2vw, 13px)",
              }}
            >
              <FaList size={14} />
            </button>
          </div>
        </div>

        {/* Properties grid */}
        <div
          className="properties-page-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          {filteredProperties.map((p) => {
            const propertyMapUrl = getMapUrl(p.location, p.mapUrl);
            const propertyImages = getPropertyImages(p.images, p.image);
            const currentImageIndex = propertyImages.length > 0 ? (propertyImageIndexes[p.id] ?? 0) % propertyImages.length : 0;
            const currentImage = propertyImages[currentImageIndex] ?? p.image;

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
                  display: "flex",
                  flexDirection: "column",
                  minHeight: viewMode === "grid" ? "420px" : "auto",
                  flex: viewMode === "grid" ? "1 1 clamp(280px, 100%, 320px)" : "1 1 100%",
                  maxWidth: viewMode === "grid" ? "calc((100% - 48px) / 3)" : "100%",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div style={{ position: "relative", height: viewMode === "grid" ? "220px" : "240px" }}>
                  <div style={{ width: "100%", height: "100%", backgroundImage: `url('${currentImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  {/* Best Deal badge removed */}
                </div>
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <div>
                    <p style={{ margin: 0, color: "#111827", fontSize: "18px", fontWeight: 800 }}>{p.price}</p>
                    <p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: "15px", fontWeight: 700 }}>{p.title}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", color: "#374151", fontSize: 13, fontWeight: 600 }}>
                    <span>Bed {p.beds}</span>
                    <span>Bath {p.baths}</span>
                    <span>Size {p.size.toLocaleString()} m²</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 13 }}>
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
        {filteredProperties.length === 0 ? (
          <p style={{ marginTop: "18px", color: "#666", fontSize: "14px" }}>
            No properties match the selected filters.
          </p>
        ) : null}
      </div>
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
                <FaPhone size={12} color="#c49a6c" />
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
                type="tel"
                inputMode="tel"
                pattern="^[1-9]\d{7,14}$"
                title="Digits only, start with country code (e.g. 255772818324)"
                value={leadPhone}
                onChange={(event) => setLeadPhone(event.target.value.replace(/\D/g, ""))}
                placeholder="255772818324"
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
              maxWidth: "880px",
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
              const galleryImages = getPropertyImages(selectedGalleryProperty.images, selectedGalleryProperty.image);
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
      <Footer />
    </>
  );
}
