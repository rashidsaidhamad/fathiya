"use client";
import { useEffect, useMemo, useState } from "react";
import { FaPhone, FaEnvelope, FaWhatsapp, FaThLarge, FaList, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSiteContent } from "../hooks/useSiteContent";
import { toMailtoHref, toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [propertyImageIndexes, setPropertyImageIndexes] = useState<Record<number, number>>({});
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

  return (
    <>
      <Navbar forceWhite />
      <div style={{ paddingTop: "70px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Page content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
          <a href="/" style={{ color: "#333", textDecoration: "none" }}>Home</a>
          <span style={{ margin: "0 6px", color: "#aaa" }}>›</span>
          <span style={{ color: "#c49a6c", fontWeight: 600 }}>Properties</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#1a1a2e", marginBottom: "24px", fontFamily: "Georgia, serif" }}>
          Properties
        </h1>

        {/* Filter bar */}
        <div
          className="properties-page-filter-bar"
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
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
              padding: "6px 10px",
              fontSize: "13px",
              color: "#444",
              cursor: "pointer",
              background: "#fff",
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
              padding: "6px 10px",
              fontSize: "13px",
              color: "#444",
              cursor: "pointer",
              background: "#fff",
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
              padding: "6px 10px",
              fontSize: "13px",
              color: "#444",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            <option value="Price High to Low">Price High to Low</option>
            <option value="Price Low to High">Price Low to High</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
          {/* View toggle */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: viewMode === "grid" ? "#c49a6c" : "#fff",
                color: viewMode === "grid" ? "#fff" : "#555",
              }}
            >
              <FaThLarge size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: viewMode === "list" ? "#c49a6c" : "#fff",
                color: viewMode === "list" ? "#fff" : "#555",
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
            display: "grid",
            gridTemplateColumns: viewMode === "grid" ? "repeat(3, 1fr)" : "1fr",
            gap: "24px",
          }}
        >
          {filteredProperties.map((p) => (
            (() => {
              const propertyMapUrl = getMapUrl(p.location, p.mapUrl);
              const propertyImages = getPropertyImages(p.images, p.image);
              const currentImageIndex = propertyImages.length > 0 ? (propertyImageIndexes[p.id] ?? 0) % propertyImages.length : 0;
              const currentImage = propertyImages[currentImageIndex] ?? p.image;
              return (
            <div
              key={p.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: "200px" }}>
                <div
                  style={{
                    width: "100%", height: "100%",
                    backgroundImage: `url('${currentImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {/* Status tags */}
                <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "5px" }}>
                  <span style={{ background: p.statusColor, color: "#fff", padding: "3px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 600 }}>
                    {p.status}
                  </span>
                  <span style={{ background: p.statusColor, color: "#fff", padding: "3px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 600 }}>
                    {p.active}
                  </span>
                </div>
                {/* Bottom action icons */}
                <div style={{ position: "absolute", bottom: "10px", left: "10px", display: "flex", gap: "6px" }}>
                  {[
                    <svg key="s" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
                    <svg key="h" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
                  ].map((icon, i) => (
                    <button key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {icon}
                    </button>
                  ))}
                  <a
                    href={propertyMapUrl}
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
                    <FaMapMarkerAlt size={12} />
                  </a>
                </div>
                {/* Prev/Next arrows */}
                <button
                  onClick={() => goToPrevPropertyImage(p.id, propertyImages.length)}
                  disabled={propertyImages.length <= 1}
                  style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: propertyImages.length <= 1 ? "default" : "pointer", fontSize: "14px", opacity: propertyImages.length <= 1 ? 0.5 : 1 }}
                  aria-label={`Previous image for ${p.title}`}
                >
                  ‹
                </button>
                <button
                  onClick={() => goToNextPropertyImage(p.id, propertyImages.length)}
                  disabled={propertyImages.length <= 1}
                  style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: propertyImages.length <= 1 ? "default" : "pointer", fontSize: "14px", opacity: propertyImages.length <= 1 ? 0.5 : 1 }}
                  aria-label={`Next image for ${p.title}`}
                >
                  ›
                </button>
              </div>

              {/* Info */}
              <div style={{ padding: "16px" }}>
                <p style={{ color: "#c49a6c", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{p.price}</p>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#222", marginBottom: "8px" }}>{p.title}</h3>
                <p style={{ color: "#777", fontSize: "12px", marginBottom: "12px", lineHeight: 1.6 }}>{p.description}</p>
                <p style={{ color: "#666", fontSize: "12px", marginBottom: "12px" }}>
                  Location: {p.location}
                  {propertyMapUrl ? (
                    <>
                      {" "}
                      <a href={propertyMapUrl} target="_blank" rel="noreferrer" style={{ color: "#c49a6c", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <FaMapMarkerAlt size={12} />
                        View Map
                      </a>
                    </>
                  ) : null}
                </p>
                <div style={{ display: "flex", gap: "14px", fontSize: "12px", fontWeight: 600, color: "#333", marginBottom: "14px" }}>
                  <span>Beds: {p.beds}</span>
                  <span>Baths: {p.baths}</span>
                  <span>Size: {p.size} m²</span>
                  <span>Year Built: {p.year}</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a href={toTelHref(p.contactPhone)} style={{ flex: 1, padding: "8px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "#555", textDecoration: "none" }}>
                    <FaPhone size={11} color="#c49a6c" /> Call
                  </a>
                  <a href={toMailtoHref(p.contactEmail)} style={{ flex: 1, padding: "8px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "12px", color: "#555", textDecoration: "none" }}>
                    <FaEnvelope size={11} color="#c49a6c" /> Email
                  </a>
                  <a href={toWhatsAppHref(p.contactWhatsapp, content.contactActions.whatsappMessage)} target="_blank" rel="noreferrer" style={{ padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "4px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <FaWhatsapp size={14} color="#25D366" />
                  </a>
                </div>
              </div>
            </div>
              );
            })()
          ))}
        </div>
        {filteredProperties.length === 0 ? (
          <p style={{ marginTop: "18px", color: "#666", fontSize: "14px" }}>
            No properties match the selected filters.
          </p>
        ) : null}
      </div>
    </div>
      <Footer />
    </>
  );
}
