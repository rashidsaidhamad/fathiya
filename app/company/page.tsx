"use client";
import {
  FaBullseye,
  FaEye,
  FaHandshake,
  FaShieldAlt,
  FaBalanceScale,
  FaLandmark,
  FaClipboardCheck,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useInView } from "../hooks/useInView";

const values = [
  {
    icon: <FaHandshake size={20} />,
    title: "Honesty",
    text: "We give clients clear, straightforward advice — no hidden fees, no surprises.",
  },
  {
    icon: <FaEye size={20} />,
    title: "Transparency",
    text: "Every step of your transaction is explained clearly, so you always know where you stand.",
  },
  {
    icon: <FaShieldAlt size={20} />,
    title: "Integrity",
    text: "We hold ourselves to the highest ethical standards in every deal we handle.",
  },
  {
    icon: <FaClipboardCheck size={20} />,
    title: "Accountability",
    text: "We stand behind our advice and follow through until the job is done.",
  },
];

const stats = [
  { value: "10+", label: "Years of combined market experience" },
  { value: "500+", label: "Happy clients across Zanzibar" },
  { value: "300+", label: "Properties sold or rented" },
  { value: "100%", label: "Legal & ZIPA compliant transactions" },
];

const team = [
  {
    name: "Amani Suleiman",
    role: "Founder & CEO",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80",
  },
  {
    name: "Fatma Khamis",
    role: "Head of Sales",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80",
  },
  {
    name: "Juma Rashid",
    role: "Legal & Compliance Advisor",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80",
  },
  {
    name: "Zainab Omar",
    role: "Client Relations Manager",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&q=80",
  },
];

const teamTestimonials = [
  {
    name: "Hassan Mrisho",
    role: "Property Buyer",
    text: "The team at Archipelago made buying land in Zanzibar feel effortless. Every step was explained clearly, and the ZIPA paperwork was handled for us.",
    stars: 5,
  },
  {
    name: "Aisha Bakari",
    role: "Foreign Investor",
    text: "As a foreign investor, I needed people I could trust. This team was transparent from day one and followed up long after the deal closed.",
    stars: 5,
  },
  {
    name: "Omar Juma",
    role: "Villa Owner, Nungwi",
    text: "Professional, responsive, and deeply knowledgeable about the local market. I would recommend them to anyone investing in Zanzibar.",
    stars: 5,
  },
];

export default function CompanyPage() {
  const story = useInView();
  const values2 = useInView();
  const team2 = useInView();
  const testimonials2 = useInView();
  const stats2 = useInView();

  return (
    <>
      <Navbar forceWhite />

      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: "380px",
          paddingTop: "110px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(11,12,19,0.7) 0%, rgba(11,12,19,0.6) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "0 20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <span style={{ color: "var(--accent-light)" }}>Our Company</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "10px" }}>
            Building Trust in Zanzibar Real Estate
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "560px", margin: "0 auto" }}>
            Archipelago Property Zanzibar connects local and international investors with safe,
            transparent, and rewarding property opportunities.
          </p>
        </div>
      </div>

      {/* Company story */}
      <section
        ref={story.ref}
        style={{
          padding: "110px 80px",
          display: "flex",
          alignItems: "center",
          gap: "80px",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            height: "420px",
            opacity: story.inView ? 1 : 0,
            transform: story.inView ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-24px",
              bottom: "-24px",
              width: "60%",
              height: "65%",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--accent-light), var(--accent))",
              opacity: 0.25,
            }}
          />
          <div
            className="hover-lift"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "72%",
              height: "300px",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 1,
            }}
          />
          <div
            className="hover-lift"
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "56%",
              height: "220px",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              border: "5px solid var(--surface)",
              backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 2,
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            opacity: story.inView ? 1 : 0,
            transform: story.inView ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-dark)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "22px",
            }}
          >
            About Our Company
          </div>
          <h2
            style={{
              fontSize: "38px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "22px",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            A Trusted Partner for Every Step of Your Property Journey
          </h2>
          <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "14px", lineHeight: 1.8 }}>
            Archipelago Property Zanzibar Company Ltd is a professional real estate company based
            in Mlandege, Zanzibar. We specialize in land sales, property rentals, and full
            investment support for local and foreign clients.
          </p>
          <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "14px", lineHeight: 1.8 }}>
            Our main goal is to help clients invest in Zanzibar safely, legally, and with
            confidence. We understand that buying land or property can be complex, especially for
            foreign investors, so we provide clear guidance, honest advice, and complete support
            through every step.
          </p>
          <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "28px", lineHeight: 1.8 }}>
            Whether you are buying land, renting a property, or planning a larger investment
            project, our experienced team ensures each process is handled professionally and
            transparently.
          </p>
          <div style={{ display: "flex", gap: "40px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "4px" }}>10+</p>
              <p style={{ fontSize: "13px", color: "var(--muted)" }}>Years of Experience</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "4px" }}>500+</p>
              <p style={{ fontSize: "13px", color: "var(--muted)" }}>Clients Served</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "4px" }}>300+</p>
              <p style={{ fontSize: "13px", color: "var(--muted)" }}>Properties Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values & Resources */}
      <section style={{ padding: "0 80px 100px", backgroundColor: "var(--surface)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
          {[
            {
              icon: <FaBullseye size={20} />,
              title: "Our Mission",
              text: "Our mission is to provide safe, transparent, and professional real estate services in Zanzibar. We help clients buy land, sell or rent properties, and complete investments with full legal compliance.",
            },
            {
              icon: <FaEye size={20} />,
              title: "Our Vision",
              text: "Our vision is to become one of the most trusted and leading real estate companies in Zanzibar by setting high standards in professionalism, legal compliance, and client satisfaction.",
            },
            {
              icon: <FaBalanceScale size={20} />,
              title: "Our Values",
              text: "At Archipelago Property Zanzibar Company Ltd, our values guide everything we do: honesty, transparency, integrity, and accountability. We provide clear communication and dependable service at every step.",
            },
            {
              icon: <FaLandmark size={20} />,
              title: "Our Resources",
              text: "We combine market knowledge, legal guidance, and verified property information to support every transaction. Our team works with trusted institutions to ensure smooth, secure outcomes for clients.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="hover-lift"
              style={{
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius-md)",
                padding: "36px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {card.icon}
              </div>
              <h3 style={{ fontSize: "20px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", marginBottom: "12px" }}>
                {card.title}
              </h3>
              <p style={{ color: "var(--ink-soft)", fontSize: "14.5px", lineHeight: 1.75 }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core values */}
      <section ref={values2.ref} style={{ padding: "100px 80px", backgroundColor: "var(--background)" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-dark)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            What Drives Us
          </div>
          <h2
            style={{
              fontSize: "40px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Our Core Values
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {values.map((v, i) => (
            <div
              key={v.title}
              className="hover-lift"
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-md)",
                padding: "30px 26px",
                boxShadow: "var(--shadow-sm)",
                opacity: values2.inView ? 1 : 0,
                transform: values2.inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "var(--radius-sm)",
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                {v.icon}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", marginBottom: "10px" }}>{v.title}</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: "13.5px", lineHeight: 1.7 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Team */}
      <section ref={team2.ref} style={{ padding: "100px 80px", backgroundColor: "var(--surface)" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-dark)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Meet Our Team
          </div>
          <h2
            style={{
              fontSize: "40px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "14px",
              letterSpacing: "-0.01em",
            }}
          >
            The People Behind Archipelago
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
            A local team of agents, legal advisors, and client managers dedicated to guiding you
            through every step of your Zanzibar property journey.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {team.map((member, i) => (
            <div
              key={member.name}
              className="hover-lift"
              style={{
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius-md)",
                padding: "32px 24px",
                textAlign: "center",
                boxShadow: "var(--shadow-sm)",
                opacity: team2.inView ? 1 : 0,
                transform: team2.inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              }}
            >
              <img
                src={member.photo}
                alt={member.name}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  margin: "0 auto 18px",
                  display: "block",
                  objectFit: "cover",
                  border: "4px solid var(--surface)",
                  boxShadow: "var(--shadow-sm)",
                }}
              />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
                {member.name}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--accent-dark)", fontWeight: 600, marginBottom: "16px" }}>
                {member.role}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {[FaLinkedinIn, FaEnvelope, FaPhone].map((Icon, j) => (
                  <span
                    key={j}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-soft)",
                      color: "var(--accent-dark)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={12} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonials2.ref} style={{ padding: "100px 80px", backgroundColor: "var(--background)" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-dark)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Testimonials
          </div>
          <h2
            style={{
              fontSize: "40px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Trusted by Our Clients
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
          {teamTestimonials.map((t, i) => (
            <div
              key={t.name}
              className="hover-lift"
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-md)",
                padding: "32px",
                position: "relative",
                boxShadow: "var(--shadow-sm)",
                opacity: testimonials2.inView ? 1 : 0,
                transform: testimonials2.inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "28px",
                  fontFamily: "var(--font-display)",
                  fontSize: "56px",
                  color: "var(--accent-soft)",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                &rdquo;
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "#e8ddd4",
                    backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=c49a6c&color=fff&size=50')`,
                    backgroundSize: "cover",
                    flexShrink: 0,
                    border: "2px solid var(--background)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                />
                <div>
                  <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)" }}>{t.name}</p>
                  <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>{t.role}</p>
                </div>
              </div>
              <p style={{ color: "var(--ink-soft)", fontSize: "14.5px", lineHeight: 1.75, marginBottom: "18px" }}>
                {t.text}
              </p>
              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} style={{ color: "#f5a623", fontSize: "16px" }}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        ref={stats2.ref}
        style={{
          position: "relative",
          backgroundColor: "var(--navy)",
          padding: "80px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 15% 20%, rgba(196,154,108,0.18) 0%, transparent 45%)",
          }}
        />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                opacity: stats2.inView ? 1 : 0,
                transform: stats2.inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontSize: "42px", fontWeight: 700, color: "var(--accent-light)", marginBottom: "10px" }}>
                {s.value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13.5px", lineHeight: 1.6, maxWidth: "220px", margin: "0 auto" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "90px 80px", backgroundColor: "var(--surface)", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "34px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}
        >
          Ready to Start Your Property Journey?
        </h2>
        <p style={{ color: "var(--ink-soft)", fontSize: "15px", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
          Talk to our team today — we're ready to help you find, buy, or invest in the right
          property in Zanzibar.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
          <a
            href="/properties"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: "var(--radius-pill)",
              textDecoration: "none",
              fontSize: "14.5px",
              fontWeight: 700,
              boxShadow: "0 10px 24px rgba(196,154,108,0.35)",
            }}
          >
            View Properties
          </a>
          <a
            href="/contact"
            style={{
              backgroundColor: "transparent",
              color: "var(--ink)",
              border: "1.5px solid var(--border)",
              padding: "14px 32px",
              borderRadius: "var(--radius-pill)",
              textDecoration: "none",
              fontSize: "14.5px",
              fontWeight: 700,
            }}
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
