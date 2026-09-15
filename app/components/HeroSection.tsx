"use client";

export default function HeroSection() {

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "680px",
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
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80')",
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
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          color: "#fff",
          padding: "0 20px",
          marginBottom: "130px",
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
            marginBottom: "28px",
            fontWeight: 600,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent-light)" }} />
          Make Your Next Move With Us
        </div>
        <h1
          className="animate-fade-up delay-200"
          style={{
            fontSize: "clamp(44px, 6.2vw, 84px)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            textShadow: "0 4px 30px rgba(0,0,0,0.35)",
            marginBottom: "22px",
          }}
        >
          Your Future Home
          <br />
          Starts Here
        </h1>
        <p
          className="animate-fade-up delay-300"
          style={{
            fontSize: "17px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.82)",
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          Discover handpicked homes, villas, and land across Zanzibar — with trusted,
          transparent guidance every step of the way.
        </p>
      </div>

      <div
        className="glass animate-fade-up delay-400"
        style={{
          position: "absolute",
          bottom: "36px",
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "90%",
          maxWidth: "1140px",
          borderRadius: "var(--radius-lg)",
          padding: "18px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          zIndex: 10,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {[
          { label: "Search by location", options: ["Zanzibar Urban/West", "Mlandege", "Stone Town", "Nungwi"] },
          { label: "Property Type", options: ["House", "Villa", "Land", "Apartment"] },
          { label: "Sell or Rent", options: ["For Sale", "For Rent"] },
          { label: "Property Status", options: ["Active", "Sold", "Pending"] },
        ].map((sel) => (
          <select
            key={sel.label}
            style={{
              flex: sel.label === "Search by location" ? 2 : 1,
              padding: "15px 16px",
              fontSize: "14.5px",
              fontFamily: "var(--font-sans)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "#fff",
              color: "var(--ink-soft)",
              cursor: "pointer",
            }}
          >
            <option>{sel.label}</option>
            {sel.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
        <button
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "15px 22px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            boxShadow: "0 8px 20px rgba(196,154,108,0.4)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
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
