"use client";
import { useState } from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    city: "",
    state: "",
    email: "",
    mobile: "",
    message: "",
    gdpr: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "500px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      />

      <div style={{ position: "relative", zIndex: 5, display: "flex", gap: "60px", width: "100%", alignItems: "center" }}>
        {/* Contact Form Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "40px",
            width: "480px",
            flexShrink: 0,
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontFamily: "Georgia, serif",
              color: "#222",
              marginBottom: "24px",
            }}
          >
            Contact Form
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            {[
              { name: "name", placeholder: "Name" },
              { name: "lastName", placeholder: "Last Name" },
              { name: "city", placeholder: "City" },
              { name: "state", placeholder: "State" },
              { name: "email", placeholder: "Email" },
              { name: "mobile", placeholder: "Mobile" },
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name as keyof typeof form] as string}
                onChange={handleChange}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#555",
                }}
              />
            ))}
          </div>
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
              marginBottom: "14px",
              color: "#555",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555", marginBottom: "20px", cursor: "pointer" }}>
            <input
              type="checkbox"
              name="gdpr"
              checked={form.gdpr}
              onChange={handleChange}
              style={{ accentColor: "#c49a6c" }}
            />
            I consent to the GDPR Terms
          </label>
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
              width: "100%",
            }}
          >
            Send Email
          </button>
        </div>

        {/* Right contact info */}
        <div style={{ color: "#fff", flex: 1 }}>
          <h2
            style={{
              fontSize: "36px",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "32px",
            }}
          >
            In need of support?
            <br />
            Get in touch!
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <FaMapMarkerAlt color="#c49a6c" size={18} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ color: "#ddd", fontSize: "15px" }}>Mlandege, Zanzibar Urban/West – Tanzania</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaEnvelope color="#c49a6c" size={16} />
              <span style={{ color: "#ddd", fontSize: "15px" }}>info@archipelagoestates.com</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaPhone color="#c49a6c" size={16} />
              <span style={{ color: "#ddd", fontSize: "15px" }}>+255 659 740 712</span>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {[
                { icon: <FaFacebookF size={14} />, href: "#" },
                { icon: <FaTwitter size={14} />, href: "#" },
                { icon: <FaYoutube size={14} />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="social-icon"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "rgba(196,154,108,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top & email buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ✉
        </button>
        <button
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>
    </section>
  );
}
