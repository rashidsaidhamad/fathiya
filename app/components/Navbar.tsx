"use client";
import { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaPhone } from "react-icons/fa";

export default function Navbar({ forceWhite = false }: { forceWhite?: boolean }) {
  const [scrolledState, setScrolledState] = useState(false);
  const scrolled = forceWhite || scrolledState;

  useEffect(() => {
    if (forceWhite) return;
    const handleScroll = () => setScrolledState(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = [
    { icon: <FaFacebookF size={14} />, href: "#", color: "#1877f2" },
    { icon: <FaTwitter size={14} />, href: "#", color: "#1da1f2" },
    { icon: <FaYoutube size={14} />, href: "#", color: "#ff0000" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        height: "70px",
        overflow: "visible",
        backgroundColor: scrolled ? "#ffffff" : "transparent",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
        transition: "background-color 0.4s ease, box-shadow 0.4s ease",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Nav */}
      <nav style={{ display: "flex", gap: "32px" }}>
        {[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Our company", href: "#" },
          { label: "Blog", href: "/blog" },
          { label: "Contact Us", href: "/contact" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            style={{
              textDecoration: "none",
              color: scrolled ? "#222" : "#fff",
              fontSize: "15px",
              fontWeight: 500,
              transition: "color 0.3s",
              paddingBottom: "3px",
              borderBottom: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#c49a6c";
              (e.currentTarget as HTMLElement).style.borderBottom = "2px solid #c49a6c";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = scrolled ? "#222" : "#fff";
              (e.currentTarget as HTMLElement).style.borderBottom = "2px solid transparent";
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Center Logo — hangs below when transparent, fits inside when scrolled */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: scrolled ? "50%" : "8px",
          transform: scrolled ? "translate(-50%, -50%)" : "translateX(-50%)",
          textAlign: "center",
          zIndex: 1001,
          transition: "top 0.4s ease, transform 0.4s ease",
        }}
      >
        <img
          src="/logo.webp"
          alt="Archipelago Real Estate"
          style={{
            height: scrolled ? "54px" : "105px",
            width: "auto",
            transition: "height 0.4s ease, filter 0.4s ease",
            filter: scrolled
              ? "brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(300%) hue-rotate(10deg)"
              : "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Right Phone */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <FaPhone size={16} color={scrolled ? "#c49a6c" : "#fff"} />
        <span style={{ color: scrolled ? "#222" : "#fff", fontSize: "15px", fontWeight: 500 }}>
          +255 659 740 712
        </span>
      </div>

      {/* Floating side social icons — only visible before scroll */}
      {!scrolled && (
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
        {socialLinks.map((s, i) => (
          <a
            key={i}
            href={s.href}
            className="social-icon"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textDecoration: "none",
              transition: "background-color 0.3s ease",
            }}
          >
            {s.icon}
          </a>
        ))}
      </div>
      )}
    </header>
  );
}
