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
    { icon: <FaFacebookF size={13} />, href: "#" },
    { icon: <FaTwitter size={13} />, href: "#" },
    { icon: <FaYoutube size={13} />, href: "#" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: scrolled ? 0 : "18px",
        left: 0,
        right: 0,
        zIndex: 2000,
        display: "flex",
        justifyContent: "center",
        transition: "top 0.4s cubic-bezier(0.16,1,0.3,1)",
        padding: "0 24px",
      }}
    >
      <div
        className={scrolled ? "glass" : ""}
        style={{
          width: "100%",
          maxWidth: "1300px",
          height: scrolled ? "68px" : "76px",
          borderRadius: "var(--radius-pill)",
          backgroundColor: scrolled ? undefined : "rgba(255,255,255,0.08)",
          border: scrolled ? undefined : "1px solid rgba(255,255,255,0.18)",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          transition: "height 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease",
          padding: "0 12px 0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
          <img
            src="/logo.webp"
            alt="Archipelago Real Estate"
            style={{
              height: "38px",
              width: "auto",
              transition: "filter 0.4s ease",
              filter: scrolled
                ? "brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(300%) hue-rotate(10deg)"
                : "brightness(0) saturate(100%) invert(100%)",
            }}
          />
        </a>

        {/* Center Nav */}
        <nav style={{ display: "flex", gap: "6px" }}>
          {[
            { label: "Home", href: "/" },
            { label: "Properties", href: "/properties" },
            { label: "Our company", href: "/company" },
            { label: "Blog", href: "/blog" },
            { label: "Contact Us", href: "/contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                textDecoration: "none",
                color: scrolled ? "var(--ink-soft)" : "rgba(255,255,255,0.92)",
                fontSize: "14.5px",
                fontWeight: 500,
                transition: "color 0.3s, background-color 0.3s",
                padding: "9px 16px",
                borderRadius: "var(--radius-pill)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = scrolled ? "var(--accent-dark)" : "#fff";
                (e.currentTarget as HTMLElement).style.backgroundColor = scrolled
                  ? "var(--accent-soft)"
                  : "rgba(255,255,255,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = scrolled ? "var(--ink-soft)" : "rgba(255,255,255,0.92)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: phone + socials */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: scrolled ? "var(--ink)" : "#fff",
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: scrolled ? "var(--accent-soft)" : "rgba(255,255,255,0.16)",
              }}
            >
              <FaPhone size={13} color={scrolled ? "var(--accent-dark)" : "#fff"} />
            </span>
            <span style={{ fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}>+255 659 740 712</span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="social-icon"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  backgroundColor: scrolled ? "var(--accent-soft)" : "rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: scrolled ? "var(--accent-dark)" : "#fff",
                  textDecoration: "none",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
