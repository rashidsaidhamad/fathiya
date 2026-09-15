"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSiteContent } from "../hooks/useSiteContent";
import type { SiteContent } from "../../lib/siteContent";

export default function HeroSection() {
  const router = useRouter();
  const content = useSiteContent();
  const [selectedLocation, setSelectedLocation] = useState("Search by location");
  const [selectedType, setSelectedType] = useState("Property Type");
  const [selectedCategory, setSelectedCategory] = useState("Sell or Rent");
  const [selectedActive, setSelectedActive] = useState("Property Status");
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/site-content", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load site content");
        }

        const payload = (await response.json()) as SiteContent;
        if (!active) return;
        setHeroBackgroundUrl(payload.homePage.heroBackgroundImage?.trim() ?? "");
      })
      .catch(() => {
        if (!active) return;
        setHeroBackgroundUrl(content.homePage.heroBackgroundImage?.trim() ?? "");
      });

    return () => {
      active = false;
    };
  }, []);

  const heroBackgroundCss = heroBackgroundUrl
    ? `url("${heroBackgroundUrl.replace(/"/g, '\\"')}")`
    : "none";

  const availableLocations = useMemo(
    () => Array.from(new Set(content.properties.map((property) => property.location))).sort(),
    [content.properties],
  );

  const availableCategories = useMemo(
    () => Array.from(new Set(content.properties.map((property) => property.status))).sort(),
    [content.properties],
  );

  const availableActiveStates = useMemo(
    () => Array.from(new Set(content.properties.map((property) => property.active))).sort(),
    [content.properties],
  );

  const availableTypes = useMemo(() => {
    const inferType = (title: string, description: string) => {
      const text = `${title} ${description}`.toLowerCase();
      if (text.includes("villa")) return "Villa";
      if (text.includes("apartment") || text.includes("flat")) return "Apartment";
      if (text.includes("land") || text.includes("plot")) return "Land";
      if (text.includes("house") || text.includes("home")) return "House";
      return "Property";
    };

    return Array.from(
      new Set(content.properties.map((property) => inferType(property.title, property.description))),
    ).sort();
  }, [content.properties]);

  const runSearch = () => {
    const query = new URLSearchParams();
    if (selectedLocation !== "Search by location") query.set("location", selectedLocation);
    if (selectedType !== "Property Type") query.set("type", selectedType);
    if (selectedCategory !== "Sell or Rent") query.set("category", selectedCategory);
    if (selectedActive !== "Property Status") query.set("active", selectedActive);

    const suffix = query.toString();
    router.push(suffix ? `/properties?${suffix}` : "/properties");
  };

  const selectStyle: React.CSSProperties = {
    flex: 2,
    padding: "15px 16px",
    fontSize: "14.5px",
    fontFamily: "var(--font-sans)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "#fff",
    color: "var(--ink-soft)",
    cursor: "pointer",
  };

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "90px",
      }}
    >
      <div
        className="hero-bg"
        style={{
          position: "absolute",
          top: "-90px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: heroBackgroundCss,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(12,13,20,0.55) 0%, rgba(12,13,20,0.35) 40%, rgba(12,13,20,0.75) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 85% 15%, rgba(196,154,108,0.35) 0%, transparent 45%)",
        }}
      />

      <div
        className="hero-copy"
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          color: "#fff",
          padding: "0 20px",
          marginBottom: "120px",
          maxWidth: "900px",
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "var(--radius-pill)",
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            fontSize: "12.5px",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: "24px",
            fontWeight: 600,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent-light)" }} />
          {content.homePage.heroEyebrow}
        </div>
        <h1
          className="animate-fade-up delay-200"
          style={{
            fontSize: "clamp(48px, 6vw, 80px)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            textShadow: "0 4px 30px rgba(0,0,0,0.35)",
          }}
        >
          {content.homePage.heroTitleLine1}
          <br />
          {content.homePage.heroTitleLine2}
        </h1>
      </div>

      <div
        className="hero-search-bar glass animate-fade-up delay-400"
        style={{
          position: "absolute",
          bottom: "30px",
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "88%",
          maxWidth: "1100px",
          borderRadius: "var(--radius-lg)",
          padding: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          zIndex: 10,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <select
          className="hero-search-field"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{ ...selectStyle, flex: 2 }}
        >
          <option value="Search by location">Search by location</option>
          {availableLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <select
          className="hero-search-field"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ ...selectStyle, flex: 1 }}
        >
          <option value="Property Type">Property Type</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="hero-search-field"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ ...selectStyle, flex: 1 }}
        >
          <option value="Sell or Rent">Sell or Rent</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="hero-search-field"
          value={selectedActive}
          onChange={(e) => setSelectedActive(e.target.value)}
          style={{ ...selectStyle, flex: 1 }}
        >
          <option value="Property Status">Property Status</option>
          {availableActiveStates.map((activeState) => (
            <option key={activeState} value={activeState}>
              {activeState}
            </option>
          ))}
        </select>
        <button
          className="hero-search-btn"
          type="button"
          onClick={runSearch}
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "15px 22px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.25s ease",
            boxShadow: "0 8px 20px rgba(196,154,108,0.4)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
