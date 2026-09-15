"use client";
import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn, FaTiktok, FaSnapchatGhost, FaPhone } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteContent } from "../hooks/useSiteContent";
import { toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

export default function Navbar({ forceWhite = false }: { forceWhite?: boolean }) {
  const [scrolledState, setScrolledState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const scrolled = forceWhite || !isHomePage || scrolledState;
  const content = useSiteContent();
  const companyLogoUrl = content.homePage.companyLogoUrl?.trim() || "/logo.webp";

  useEffect(() => {
    if (forceWhite || !isHomePage) return;
    const handleScroll = () => setScrolledState(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceWhite, isHomePage]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
        top: scrolled ? 0 : "18px",
        left: 0,
        right: 0,
        zIndex: 2000,
        overflow: "visible",
        transition: "top 0.4s cubic-bezier(0.16,1,0.3,1)",
        padding: "0 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className={scrolled ? "glass-dark" : ""}
        style={{
          width: "100%",
          maxWidth: "1320px",
          height: scrolled ? "68px" : "76px",
          borderRadius: "var(--radius-pill)",
          backgroundColor: scrolled ? undefined : "rgba(255,255,255,0.08)",
          border: scrolled ? undefined : "1px solid rgba(255,255,255,0.18)",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          transition: "height 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Nav */}
        <nav className="nav-links" style={{ display: "flex", gap: "6px" }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                textDecoration: "none",
                color: "rgba(255,255,255,0.92)",
                fontSize: "14.5px",
                fontWeight: 500,
                transition: "color 0.3s, background-color 0.3s",
                padding: "9px 16px",
                borderRadius: "var(--radius-pill)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.92)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
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
          aria-expanded={menuOpen}
          aria-controls="mobile-sidebar"
          style={{
            display: "none",
            border: "1px solid rgba(255,255,255,0.5)",
            background: "transparent",
            color: "#fff",
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
              transition: "height 0.4s ease",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Right Phone */}
        <a className="nav-phone" href={toTelHref(content.contactActions.phone)} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.16)",
            }}
          >
            <FaPhone size={13} color="#fff" />
          </span>
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}>
            {content.contactActions.phone}
          </span>
        </a>
      </div>

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
            inset: 0,
            backgroundColor: "rgba(7,10,20,0.35)",
            zIndex: 2500,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            id="mobile-sidebar"
            className="glass-dark"
            style={{
              position: "absolute",
              top: "70px",
              right: 0,
              bottom: 0,
              width: "min(82vw, 320px)",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "-10px 0 28px rgba(0,0,0,0.28)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}`}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "8px 4px" }}
              >
                {item.label}
              </Link>
            ))}
            <a href={toTelHref(content.contactActions.phone)} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px", marginTop: "10px" }}>
              {content.contactActions.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
