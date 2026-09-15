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

  const inputStyle: React.CSSProperties = {
    padding: "12px 16px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    color: "var(--ink)",
    backgroundColor: "#fff",
    transition: "border-color 0.2s",
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "560px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        padding: "100px 80px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(120deg, rgba(11,12,19,0.82) 0%, rgba(11,12,19,0.55) 100%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 5, display: "flex", gap: "70px", width: "100%", alignItems: "center" }}>
        {/* Contact Form Card */}
        <div
          className="glass"
          style={{
            borderRadius: "var(--radius-lg)",
            padding: "44px",
            width: "480px",
            flexShrink: 0,
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "6px 14px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-dark)",
              fontSize: "11.5px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Get In Touch
          </div>
          <h2
            style={{
              fontSize: "26px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "26px",
            }}
          >
            Send us a message
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
                style={inputStyle}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
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
              ...inputStyle,
              width: "100%",
              resize: "vertical",
              marginBottom: "14px",
            }}
            onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
            onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink-soft)", marginBottom: "22px", cursor: "pointer" }}>
            <input
              type="checkbox"
              name="gdpr"
              checked={form.gdpr}
              onChange={handleChange}
              style={{ accentColor: "var(--accent)" }}
            />
            I consent to the GDPR Terms
          </label>
          <button
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "#fff",
              border: "none",
              padding: "14px 28px",
              borderRadius: "var(--radius-pill)",
              fontSize: "14.5px",
              cursor: "pointer",
              fontWeight: 700,
              width: "100%",
              boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
              transition: "transform 0.25s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
          >
            Send Email
          </button>
        </div>

        {/* Right contact info */}
        <div style={{ color: "#fff", flex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 42px)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "36px",
            }}
          >
            In need of support?
            <br />
            Get in touch!
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              { icon: <FaMapMarkerAlt size={16} />, text: "Mlandege, Zanzibar Urban/West – Tanzania" },
              { icon: <FaEnvelope size={15} />, text: "info@archipelagoestates.com" },
              { icon: <FaPhone size={15} />, text: "+255 659 740 712" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "rgba(196,154,108,0.22)",
                    color: "var(--accent-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "15px" }}>{item.text}</span>
              </div>
            ))}
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
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.2)",
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
          bottom: "24px",
          right: "24px",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            color: "var(--accent-dark)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ✉
        </button>
        <button
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            color: "var(--accent-dark)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>
    </section>
  );
}
