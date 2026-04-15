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
          filter: "brightness(0.55)",
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
        }}
      >
        <p
          className="animate-fade-in"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: 400,
          }}
        >
          {content.homePage.heroEyebrow}
        </p>
        <h1
          className="animate-fade-up delay-200"
          style={{
            fontSize: "clamp(48px, 6vw, 80px)",
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.1,
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {content.homePage.heroTitleLine1}
          <br />
          {content.homePage.heroTitleLine2}
        </h1>
      </div>

      <div
        className="hero-search-bar animate-fade-up delay-400"
        style={{
          position: "absolute",
          bottom: "30px",
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "88%",
          maxWidth: "1100px",
          backgroundColor: "rgba(20,20,20,0.85)",
          borderRadius: "6px",
          padding: "16px 24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <select
          className="hero-search-field"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            flex: 2,
            padding: "14px 16px",
            fontSize: "15px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#fff",
            color: "#555",
            cursor: "pointer",
          }}
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
          style={{
            flex: 1,
            padding: "14px 16px",
            fontSize: "15px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#fff",
            color: "#555",
            cursor: "pointer",
          }}
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
          style={{
            flex: 1,
            padding: "14px 16px",
            fontSize: "15px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#fff",
            color: "#555",
            cursor: "pointer",
          }}
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
          style={{
            flex: 1,
            padding: "14px 16px",
            fontSize: "15px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#fff",
            color: "#555",
            cursor: "pointer",
          }}
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
            backgroundColor: "#c49a6c",
            border: "none",
            borderRadius: "4px",
            padding: "14px 18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a07850")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#c49a6c")}
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
