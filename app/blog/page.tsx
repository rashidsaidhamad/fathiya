"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const allArticles = [
  {
    slug: "buying-land-zanzibar",
    title: "Complete Guide to Buying Land in Zanzibar",
    date: "December 14, 2025",
    excerpt: "Buying land in Zanzibar is a great opportunity for both local buyers and foreign investors. Zanzibar offers strong economic growth and a thriving property market.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80",
  },
  {
    slug: "zipa-approval-foreign-property",
    title: "How ZIPA Approval Works for Foreign Property Investors",
    date: "December 14, 2025",
    excerpt: "Zanzibar is one of the most attractive destinations for foreign property investors. Its growing tourism industry, s ...",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  },
  {
    slug: "best-travel-experiences",
    title: "Best Travel Experiences and Property Opportunities",
    date: "March 4, 2016",
    excerpt: "Zanzibar is a beautiful island destination that offers more than just holidays. It is a place where you can enjoy a ...",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  },
  {
    slug: "investment-opportunities-zanzibar",
    title: "Top Investment Opportunities in Zanzibar 2025",
    date: "January 10, 2026",
    excerpt: "Zanzibar's real estate market is booming. With new regulations and increasing tourism, 2025 is the ideal time to invest ...",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    slug: "property-laws-foreigners",
    title: "Understanding Property Laws for Foreigners in Tanzania",
    date: "February 5, 2026",
    excerpt: "Foreign nationals looking to buy property in Tanzania must navigate specific legal frameworks. Here is what you need to know ...",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
];

const [featured, ...rest] = allArticles;

export default function BlogPage() {
  return (
    <>
      <Navbar forceWhite />

      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: "320px",
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
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(12,13,20,0.68) 0%, rgba(12,13,20,0.58) 100%)",
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
            <span style={{ color: "var(--accent-light)" }}>Blog</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "10px" }}>
            Insights &amp; Stories
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto" }}>
            Property laws, ownership guides, and investment opportunities across Zanzibar.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", minHeight: "60vh", padding: "80px 80px 100px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          {/* Featured article */}
          <a
            href={`/blog/${featured.slug}`}
            className="hover-lift"
            style={{
              display: "flex",
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              textDecoration: "none",
              marginBottom: "56px",
            }}
          >
            <div
              style={{
                width: "48%",
                minHeight: "360px",
                backgroundImage: `url('${featured.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div style={{ flex: 1, padding: "44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-dark)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Featured
              </span>
              <h2
                style={{
                  fontSize: "28px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "14px",
                  lineHeight: 1.3,
                }}
              >
                {featured.title}
              </h2>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "14px", fontWeight: 600 }}>{featured.date}</p>
              <p style={{ fontSize: "14.5px", color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: "22px" }}>
                {featured.excerpt}
              </p>
              <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                Continue reading <span style={{ fontSize: "17px" }}>›</span>
              </span>
            </div>
          </a>

          {/* Rest of the articles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {rest.map((a) => (
              <a
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="hover-lift"
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <div
                  style={{
                    height: "190px",
                    backgroundImage: `url('${a.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: "22px" }}>
                  <p style={{ fontSize: "12px", color: "var(--accent-dark)", marginBottom: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>{a.date}</p>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", marginBottom: "10px", lineHeight: 1.4 }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: "16px" }}>
                    {a.excerpt}
                  </p>
                  <span style={{ fontSize: "13.5px", color: "var(--ink)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                    Continue reading <span style={{ fontSize: "16px" }}>›</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
