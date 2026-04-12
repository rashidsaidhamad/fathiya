"use client";
import { useInView } from "../hooks/useInView";

export default function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      style={{
        padding: "80px 80px",
        display: "flex",
        alignItems: "center",
        gap: "60px",
        backgroundColor: "#fff",
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
        <p
          style={{
            color: "#c49a6c",
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>⊞</span> ABOUT US
        </p>
        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Georgia, serif",
            color: "#222",
            marginBottom: "20px",
            lineHeight: 1.2,
          }}
        >
          Find Your Perfect Property
          <br />
          in Zanzibar
        </h2>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "10px", lineHeight: 1.7 }}>
          Buy land, own a home, or rent a property with{" "}
          <a href="#" style={{ color: "#c49a6c" }}>Archipelago Property Zanzibar.</a>
        </p>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "10px", lineHeight: 1.7 }}>
          We support both local and foreign investors with all{" "}
          <a href="#" style={{ color: "#c49a6c" }}>legal</a> documents, land regulations, and{" "}
          <a href="#" style={{ color: "#c49a6c" }}>ZIPA</a> investment procedures.
        </p>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px", lineHeight: 1.7 }}>
          Our service is safe, transparent, and trusted across Zanzibar.
        </p>
        {[
          "Secure Land Purchases",
          "Buy or Rent Quality Properties",
          "Complete Legal and Government Support",
          "Investor Guidance with ZIPA",
        ].map((item) => (
          <p key={item} style={{ color: "#555", fontSize: "14px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#c49a6c", fontWeight: "bold" }}>✓</span> {item}
          </p>
        ))}
        <p style={{ color: "#555", fontSize: "14px", marginTop: "16px", marginBottom: "28px" }}>
          Begin your property journey today, we are ready to assist you.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            style={{
              backgroundColor: "#c49a6c",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            About Us
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: "#333",
              border: "1.5px solid #333",
              padding: "12px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
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
          height: "380px",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(40px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        {/* For Rent image */}
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "20px",
            width: "55%",
            height: "260px",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
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
              top: "12px",
              left: "12px",
              backgroundColor: "#4caf50",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "3px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            For Rent
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "3px",
              fontSize: "12px",
            }}
          >
            1 listing
          </div>
        </div>

        {/* For Sale image */}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "80px",
            width: "55%",
            height: "260px",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
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
              top: "12px",
              left: "12px",
              backgroundColor: "#c49a6c",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "3px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            For Sale
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "3px",
              fontSize: "12px",
            }}
          >
            2 listings
          </div>
        </div>
      </div>
    </section>
  );
}
