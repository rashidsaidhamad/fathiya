"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? "#ffffff" : "transparent",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        padding: "12px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Nav */}
      <nav style={{ display: "flex", gap: "32px" }}>
        {["Properties", "Our company", "Consulting", "Blog", "Contact Us"].map(
          (item) => (
            <a
              key={item}
              href="#"
              style={{
                textDecoration: "none",
                color: scrolled ? "#222" : "#fff",
                fontSize: "15px",
                fontWeight: 500,
                transition: "color 0.3s",
              }}
            >
              {item}
            </a>
          )
        )}
      </nav>

      {/* Center Logo */}
      <div style={{ textAlign: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "rgba(196,154,108,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 4px",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 48 48" fill="white">
            <path d="M12 36 L12 22 L24 12 L36 22 L36 36 Z" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M18 36 L18 28 L30 28 L30 36" fill="none" stroke="white" strokeWidth="2"/>
            <circle cx="38" cy="10" r="6" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5"/>
            <line x1="30" y1="18" x2="42" y2="18" stroke="white" strokeWidth="1"/>
            <line x1="36" y1="4" x2="36" y2="16" stroke="white" strokeWidth="1"/>
          </svg>
        </div>
        <div style={{ color: scrolled ? "#c49a6c" : "#fff", fontWeight: "bold", fontSize: "13px", letterSpacing: "2px" }}>
          Archipelago
        </div>
        <div style={{ color: scrolled ? "#999" : "#ddd", fontSize: "9px", letterSpacing: "3px" }}>
          REAL ESTATE
        </div>
      </div>

      {/* Right Phone */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#222" : "#fff"} strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12 19.79 19.79 0 011.5 3.18 2 2 0 013.5 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
        </svg>
        <span style={{ color: scrolled ? "#222" : "#fff", fontSize: "15px", fontWeight: 500 }}>
          +255 659 740 712
        </span>
      </div>

      {/* Scroll: social icons on right edge */}
      {scrolled && (
        <div
          style={{
            position: "fixed",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: 999,
          }}
        >
          {["facebook", "twitter", "youtube"].map((s) => (
            <a
              key={s}
              href="#"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              {s === "facebook" && "f"}
              {s === "twitter" && "t"}
              {s === "youtube" && "▶"}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
