"use client";
import { useInView } from "../hooks/useInView";

export default function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      style={{
        padding: "110px 80px",
        display: "flex",
        alignItems: "center",
        gap: "80px",
        backgroundColor: "var(--surface)",
      }}
    >
      {/* Left Text */}
      <div
        style={{
          flex: 1,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(-40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
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
            marginBottom: "22px",
          }}
        >
          About Us
        </div>
        <h2
          style={{
            fontSize: "42px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "22px",
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
          }}
        >
          Find Your Perfect Property
          <br />
          in Zanzibar
        </h2>
        <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "12px", lineHeight: 1.75 }}>
          Buy land, own a home, or rent a property with{" "}
          <a href="#" style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>Archipelago Property Zanzibar.</a>
        </p>
        <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "12px", lineHeight: 1.75 }}>
          We support both local and foreign investors with all{" "}
          <a href="#" style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>legal</a> documents, land regulations, and{" "}
          <a href="#" style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>ZIPA</a> investment procedures.
        </p>
        <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "26px", lineHeight: 1.75 }}>
          Our service is safe, transparent, and trusted across Zanzibar.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {[
            "Secure Land Purchases",
            "Buy or Rent Quality Properties",
            "Complete Legal and Government Support",
            "Investor Guidance with ZIPA",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-dark)",
                  fontSize: "12px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span style={{ color: "var(--ink)", fontSize: "14.5px", fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: "14.5px", marginBottom: "32px", lineHeight: 1.7 }}>
          Begin your property journey today, we are ready to assist you.
        </p>
        <div style={{ display: "flex", gap: "14px" }}>
          <button
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "#fff",
              border: "none",
              padding: "14px 30px",
              borderRadius: "var(--radius-pill)",
              fontSize: "14.5px",
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
              transition: "transform 0.25s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          >
            About Us
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: "var(--ink)",
              border: "1.5px solid var(--border)",
              padding: "14px 30px",
              borderRadius: "var(--radius-pill)",
              fontSize: "14.5px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "border-color 0.25s ease, color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLElement).style.color = "var(--accent-dark)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--ink)";
            }}
          >
            Chat on WhatsApp
          </button>
        </div>
      </div>

      {/* Right Image Grid */}
      <div
        style={{
          flex: 1,
          position: "relative",
          height: "420px",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(40px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-24px",
            top: "-24px",
            width: "58%",
            height: "70%",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, var(--accent-light), var(--accent))",
            opacity: 0.25,
            zIndex: 0,
          }}
        />
        {/* For Rent image */}
        <div
          className="hover-lift"
          style={{
            position: "absolute",
            left: "0",
            top: "20px",
            width: "56%",
            height: "280px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.45) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              backgroundColor: "rgba(255,255,255,0.92)",
              color: "#2f9e5b",
              padding: "5px 12px",
              borderRadius: "var(--radius-pill)",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            For Rent
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              color: "#fff",
              padding: "4px 4px",
              fontSize: "12.5px",
              fontWeight: 600,
            }}
          >
            1 listing
          </div>
        </div>

        {/* For Sale image */}
        <div
          className="hover-lift"
          style={{
            position: "absolute",
            right: "0",
            top: "100px",
            width: "56%",
            height: "280px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
            border: "5px solid var(--surface)",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.45) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              backgroundColor: "var(--accent)",
              color: "#fff",
              padding: "5px 12px",
              borderRadius: "var(--radius-pill)",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            For Sale
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              color: "#fff",
              padding: "4px 4px",
              fontSize: "12.5px",
              fontWeight: 600,
            }}
          >
            2 listings
          </div>
        </div>
      </div>
    </section>
  );
}
