"use client";

import { useSiteContent } from "../hooks/useSiteContent";

export default function HeroSection() {
  const content = useSiteContent();
  const heroBackgroundUrl = content.homePage.heroBackgroundImage?.trim() ?? "";
  const heroBackgroundCss = heroBackgroundUrl
    ? `url("${heroBackgroundUrl.replace(/"/g, '\\"')}")`
    : "none";
  const locationDistrictGroups = [
    {
      group: "Zanzibar (Unguja) Districts",
      districts: [
        "Urban",
        "West A",
        "West B",
        "North A",
        "North B",
        "Central",
        "South",
      ],
    },
    {
      group: "Pemba Districts",
      districts: ["Wete", "Micheweni", "Chake Chake", "Mkoani"],
    },
  ];

  return (
    <section
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
        className="animate-fade-up delay-400"
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
          gap: "12px",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {[
          { label: "Search by location", options: [] },
          { label: "Property Type", options: ["House", "Villa", "Land", "Apartment"] },
          { label: "Sell or Rent", options: ["For Sale", "For Rent"] },
          { label: "Property Status", options: ["Active", "Sold", "Pending"] },
        ].map((sel) => (
          <select
            key={sel.label}
            style={{
              flex: sel.label === "Search by location" ? 2 : 1,
              padding: "14px 16px",
              fontSize: "15px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#fff",
              color: "#555",
              cursor: "pointer",
            }}
          >
            <option>{sel.label}</option>
            {sel.label === "Search by location"
              ? locationDistrictGroups.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.districts.map((district) => (
                      <option key={district}>{district}</option>
                    ))}
                  </optgroup>
                ))
              : sel.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
        <button
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
