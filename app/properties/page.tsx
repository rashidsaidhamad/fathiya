"use client";
import { useEffect, useMemo, useState } from "react";
import { FaPhone, FaEnvelope, FaWhatsapp, FaThLarge, FaList, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
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

  const filterSelectStyle: React.CSSProperties = {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-pill)",
    padding: "clamp(8px, 1.4vw, 10px) clamp(14px, 2vw, 16px)",
    fontSize: "clamp(12px, 2vw, 13px)",
    fontFamily: "var(--font-sans)",
    color: "var(--ink-soft)",
    cursor: "pointer",
    background: "var(--background)",
    flex: "1 1 calc(50% - 4px)",
    minWidth: "120px",
  };

  return (
    <>
      <Navbar forceWhite />

      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: "300px",
          paddingTop: "110px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(12,13,20,0.65) 0%, rgba(12,13,20,0.55) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "0 20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <span style={{ color: "var(--accent-light)" }}>Properties</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 46px)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "10px" }}>
            Explore Our Properties
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto" }}>
            Handpicked homes, villas, and land across Zanzibar — ready for you to discover.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
      {/* Page content */}
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "clamp(28px, 4vw, 44px) clamp(14px, 3vw, 40px) 0" }}>
        {/* Filter bar */}
        <div
          className="properties-page-filter-bar glass"
          style={{
            borderRadius: "var(--radius-md)",
            padding: "clamp(14px, 2vw, 18px) clamp(16px, 3vw, 22px)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "32px",
            flexWrap: "wrap",
            boxShadow: "var(--shadow-sm)",
            backgroundColor: "var(--surface)",
          }}
        >
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={filterSelectStyle}
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
            style={filterSelectStyle}
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
            style={filterSelectStyle}
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
                width: 38,
                height: 38,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                backgroundColor: viewMode === "grid" ? "var(--accent)" : "var(--background)",
                color: viewMode === "grid" ? "#fff" : "var(--ink-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.25s, color 0.25s",
              }}
            >
              <FaThLarge size={13} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                width: 38,
                height: 38,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                backgroundColor: viewMode === "list" ? "var(--accent)" : "var(--background)",
                color: viewMode === "list" ? "#fff" : "var(--ink-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.25s, color 0.25s",
              }}
            >
              <FaList size={13} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: "13.5px", color: "var(--muted)", marginBottom: "20px", fontWeight: 500 }}>
          Showing {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"}
        </p>

        {/* Properties grid */}
        <div
          className="properties-page-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "26px",
            alignItems: "flex-start",
            paddingBottom: "40px",
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
                className="hover-lift"
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: viewMode === "grid" ? "500px" : "auto",
                  flex: viewMode === "grid" ? "1 1 clamp(280px, 100%, 320px)" : "1 1 100%",
                  maxWidth: viewMode === "grid" ? "calc((100% - 52px) / 3)" : "100%",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div style={{ position: "relative", height: viewMode === "grid" ? "230px" : "250px" }}>
                  <div style={{ width: "100%", height: "100%", backgroundImage: `url('${currentImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(11,12,19,0.72) 100%)" }} />
                  <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 6 }}>
                    <span style={{ backgroundColor: p.statusColor || "var(--accent)", color: "#fff", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                      {p.status}
                    </span>
                    <span style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#2f9e5b", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                      {p.active}
                    </span>
                  </div>
                  <p style={{ position: "absolute", left: 16, bottom: 12, margin: 0, color: "#fff", fontSize: "21px", fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
                    {p.price}
                  </p>
                </div>
                <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  <p style={{ margin: 0, color: "var(--ink)", fontSize: "16px", fontWeight: 700, lineHeight: 1.35 }}>{p.title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-soft)", fontSize: 13 }}>
                    <FaMapMarkerAlt color="var(--accent-dark)" size={13} />
                    <span style={{ lineHeight: 1.5 }}>{p.location}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "var(--ink-soft)", fontSize: 13, fontWeight: 600, paddingTop: 12, paddingBottom: 12, borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FaBed color="var(--accent-dark)" size={13} /> {p.beds} Beds</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FaBath color="var(--accent-dark)" size={13} /> {p.baths} Baths</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FaRulerCombined color="var(--accent-dark)" size={13} /> {p.size.toLocaleString("en-US")} m²</span>
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
        {filteredProperties.length === 0 ? (
          <p style={{ marginTop: "-16px", paddingBottom: "40px", color: "var(--muted)", fontSize: "14px" }}>
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
                <FaPhone size={12} color="var(--accent-dark)" />
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
              {selectedEmailProperty.title}
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
                type="tel"
                inputMode="tel"
                pattern="^[1-9]\d{7,14}$"
                title="Digits only, start with country code (e.g. 255772818324)"
                value={leadPhone}
                onChange={(event) => setLeadPhone(event.target.value.replace(/\D/g, ""))}
                placeholder="255772818324"
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
              maxWidth: "880px",
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
                <h3 style={{ margin: 0, color: "var(--ink)", fontSize: "22px", fontFamily: "var(--font-display)" }}>{selectedGalleryProperty.title}</h3>
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "13px" }}>{selectedGalleryProperty.location}</p>
              </div>
              <button type="button" onClick={closeGalleryModal} style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "var(--radius-sm)", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>

            {(() => {
              const galleryImages = getPropertyImages(selectedGalleryProperty.images, selectedGalleryProperty.image);
              const currentGalleryImage = galleryImages[galleryImageIndex] ?? galleryImages[0] ?? selectedGalleryProperty.image;
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
                        key={`${selectedGalleryProperty.id}-${index}`}
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
                    <button type="button" onClick={() => openPropertyVideo(selectedGalleryProperty.videoUrl ?? "", selectedGalleryProperty.title)} style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "var(--radius-sm)", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
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
