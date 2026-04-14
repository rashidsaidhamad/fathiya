"use client";
import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn, FaTiktok, FaSnapchatGhost, FaPhone } from "react-icons/fa";
import Link from "next/link";
import { useSiteContent } from "../hooks/useSiteContent";
import { toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

export default function Navbar({ forceWhite = false }: { forceWhite?: boolean }) {
  const [scrolledState, setScrolledState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = forceWhite || scrolledState;
  const content = useSiteContent();
  const companyLogoUrl = content.homePage.companyLogoUrl?.trim() || "/logo.webp";

  useEffect(() => {
    if (forceWhite) return;
    const handleScroll = () => setScrolledState(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceWhite]);

  const socialLinks = [
    { icon: <FaInstagram size={14} />, href: "https://www.instagram.com/archipelago_properties?igsh=dHQ0NnVrbmxqbno0", title: "Instagram" },
    {
      icon: <FaWhatsapp size={14} />,
      href: "https://wa.me/message/DSUFKUBMIL5HN1",
      title: "WhatsApp",
    },
    { icon: <FaLinkedinIn size={14} />, href: "#", title: "LinkedIn" },
    { icon: <FaTiktok size={14} />, href: "https://www.tiktok.com/@archipelago_properties?_r=1&_t=ZS-95AoJGjwiRR", title: "TikTok" },
    { icon: <FaSnapchatGhost size={14} />, href: "https://www.snapchat.com/add/archipelago2026?share_id=VqMRxcOy5XA&locale=en-GB", title: "Snapchat" },
    { icon: <FaFacebookF size={14} />, href: "https://www.facebook.com/share/18dtiBWTnj/", title: "Facebook" },
  ];

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Our company", href: "/company" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header
      className="nav-root"
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
      <nav className="nav-links" style={{ display: "flex", gap: "32px" }}>
        {navItems.map((item) => (
          <Link
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
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="nav-menu-btn"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        style={{
          display: "none",
          border: "1px solid rgba(255,255,255,0.5)",
          background: "transparent",
          color: scrolled ? "#222" : "#fff",
          borderRadius: "8px",
          padding: "8px 10px",
          fontSize: "18px",
          cursor: "pointer",
          zIndex: 3001,
        }}
      >
        {menuOpen ? "×" : "☰"}
      </button>

      {/* Center Logo — hangs below when transparent, fits inside when scrolled */}
      <div
        className="nav-logo-wrap"
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
          src={companyLogoUrl}
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
      <a className="nav-phone" href={toTelHref(content.contactActions.phone)} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <FaPhone size={16} color={scrolled ? "#c49a6c" : "#fff"} />
        <span style={{ color: scrolled ? "#222" : "#fff", fontSize: "15px", fontWeight: 500 }}>
          {content.contactActions.phone}
        </span>
      </a>

      {/* Floating side social icons — only visible before scroll */}
      {!scrolled && (
      <div
        className="nav-social"
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
            title={s.title}
            className="social-icon"
            target="_blank"
            rel="noreferrer"
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

      {menuOpen && (
        <div
          className="nav-mobile-panel"
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            backgroundColor: "#111827",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "14px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 2500,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={`mobile-${item.label}`}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: 500 }}
            >
              {item.label}
            </Link>
          ))}
          <a href={toTelHref(content.contactActions.phone)} style={{ color: "#d1d5db", textDecoration: "none", fontSize: "14px" }}>
            {content.contactActions.phone}
          </a>
        </div>
      )}
    </header>
  );
}
