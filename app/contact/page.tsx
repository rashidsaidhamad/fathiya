"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaFacebookF, FaWhatsapp, FaTiktok, FaTwitter, FaLinkedinIn, FaPinterestP, FaInstagram } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactMap = dynamic(() => import("../components/ContactMap"), { ssr: false });

const latestListings = [
  {
    title: "Sample Property in Zanzibar 3",
    price: "$ 770,000",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
  },
  {
    title: "Sample Property in Zanzibar 2",
    price: "$ 770,000",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&q=80",
  },
  {
    title: "Sample Property in Zanzibar 1",
    price: "$ 770,000",
    image: "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=200&q=80",
  },
];

const socialLinks = [
  { icon: <FaFacebookF size={14} />, href: "#" },
  { icon: <FaWhatsapp size={14} />, href: "#" },
  { icon: <FaTiktok size={14} />, href: "#" },
  { icon: <FaTwitter size={14} />, href: "#" },
  { icon: <FaLinkedinIn size={14} />, href: "#" },
  { icon: <FaPinterestP size={14} />, href: "#" },
  { icon: <FaInstagram size={14} />, href: "#" },
];

export default function ContactPage() {
  const [priceRange, setPriceRange] = useState(10000000);

  return (
    <>
      <Navbar forceWhite />
      <div style={{ paddingTop: "70px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Map */}
        <ContactMap />

        {/* Page content */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
            <a href="/" style={{ color: "#555", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 6px", color: "#aaa" }}>›</span>
            <span style={{ color: "#c49a6c", fontWeight: 600 }}>Contact Us</span>
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>
            {/* Left: Contact info + form */}
            <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "36px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a2e", marginBottom: "6px" }}>
                Archipelago Properties Zanzibar
              </h1>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
                Mlandege, Zanzibar Urban/West – Tanzania
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    style={{
                      width: 30, height: 30,
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#555", textDecoration: "none",
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#c49a6c";
                      (e.currentTarget as HTMLElement).style.color = "#c49a6c";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#ddd";
                      (e.currentTarget as HTMLElement).style.color = "#555";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Contact details */}
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px 0", fontSize: "14px", marginBottom: "20px" }}>
                <span style={{ color: "#888" }}>Phone:</span>
                <span style={{ color: "#333", fontWeight: 500 }}>+255 659 740 712</span>
                <span style={{ color: "#888" }}>Mobile:</span>
                <span style={{ color: "#333", fontWeight: 500 }}>+255 659 740 712</span>
                <span style={{ color: "#888" }}>Email:</span>
                <a href="mailto:archipelagoproperties.zanzibar@gmail.com" style={{ color: "#c49a6c", textDecoration: "none", fontWeight: 500 }}>
                  archipelagoproperties.zanzibar@gmail.com
                </a>
              </div>

              {/* Description */}
              <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic", borderLeft: "3px solid #c49a6c", paddingLeft: "12px" }}>
                We are here to help you with land, property, and investment opportunities in Zanzibar.
                Whether you want to buy land, sell or rent a property, or need legal and investment support, our team is ready to assist you
              </p>

              {/* Logo */}
              <div style={{ marginBottom: "28px" }}>
                <img src="/logo.webp" alt="Archipelago Real Estate" style={{ height: "60px", filter: "brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(300%)" }} />
              </div>

              {/* Contact form */}
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>
                Contact Me
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                {["Your Name", "Your Email", "Your Phone"].map((ph) => (
                  <input
                    key={ph}
                    placeholder={ph}
                    style={{
                      padding: "10px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "13px",
                      outline: "none",
                      color: "#333",
                    }}
                  />
                ))}
              </div>
              <textarea
                rows={5}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "13px",
                  resize: "vertical",
                  outline: "none",
                  marginBottom: "14px",
                  boxSizing: "border-box",
                  color: "#333",
                }}
              />
              <button
                style={{
                  backgroundColor: "#c49a6c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "11px 28px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a07850")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#c49a6c")}
              >
                Send Email
              </button>
            </div>

            {/* Right: Advanced Search + Latest Listings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Advanced Search */}
              <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>
                  Advanced Search
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {["Types", "Location", "All Types", "Sell or Rent", "Bedrooms", "Listing Status"].map((f, i) => (
                    i === 1 ? (
                      <input
                        key={f}
                        placeholder="Location"
                        style={{ padding: "9px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px", outline: "none" }}
                      />
                    ) : (
                      <select key={f} style={{ padding: "9px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px", color: "#555", background: "#fff", cursor: "pointer" }}>
                        <option>{f}</option>
                      </select>
                    )
                  ))}
                  {/* Price range */}
                  <div>
                    <p style={{ fontSize: "12px", color: "#c49a6c", marginBottom: "6px" }}>
                      Price range: $ 0 to $ {priceRange.toLocaleString()}
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={10000000}
                      step={100000}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#c49a6c" }}
                    />
                  </div>
                  <a href="#" style={{ color: "#c49a6c", fontSize: "13px", textDecoration: "none" }}>More Search Options</a>
                  <button
                    style={{
                      backgroundColor: "#c49a6c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "11px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: "4px",
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Latest Listings */}
              <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>
                  Latest Listings
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {latestListings.map((l, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <img
                        src={l.image}
                        alt={l.title}
                        style={{ width: 70, height: 55, objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#222", marginBottom: "4px" }}>{l.title}</p>
                        <p style={{ fontSize: "13px", color: "#c49a6c", fontWeight: 700 }}>{l.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
